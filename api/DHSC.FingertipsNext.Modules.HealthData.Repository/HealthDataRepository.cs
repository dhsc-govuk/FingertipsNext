using System.Data;
using System.Diagnostics.CodeAnalysis;
using System.Globalization;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private const string DEPRIVATION = "deprivation";

    private readonly HealthDataDbContext _dbContext =
        healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    /// <summary>
    ///     Will retrieve the indicator dimension data for the requested indicator ID while also
    ///     obtaining the latest year that data is available for the indicator based on the area codes provided.
    ///     Note: both in terms of intent and performance this is sub-optimal and should be refactored at the earliest
    ///     opportunity
    ///     post-POC under DHSCFT-678.
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes"></param>
    /// <returns>IndicatorDimensionModel containing relevant indicator metadata</returns>
    public async Task<IndicatorDimensionModel?> GetIndicatorDimensionAsync(int indicatorId, string[] areaCodes, bool includeUnpublished = false)
    {
        var queryable = _dbContext.GetHealthMeasures(includeUnpublished);
        var model = await queryable
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(HealthDataPredicates.IsInAreaCodes(areaCodes))
            .Where(HealthDataPredicates.IsNotEnglandWhenMultipleRequested(areaCodes))
            .OrderByDescending(healthMeasure => healthMeasure.Year)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Select(healthMeasure => new IndicatorDimensionModel
            {
                IndicatorId = healthMeasure.IndicatorDimension.IndicatorId,
                IndicatorKey = healthMeasure.IndicatorKey,
                Name = healthMeasure.IndicatorDimension.Name,
                Polarity = healthMeasure.IndicatorDimension.Polarity,
                BenchmarkComparisonMethod = healthMeasure.IndicatorDimension.BenchmarkComparisonMethod,
                LatestYear = healthMeasure.Year,
                CollectionFrequency = healthMeasure.IndicatorDimension.CollectionFrequency
            })
            .Take(1)
            .FirstOrDefaultAsync();

        if (model != null) return model;

        // Default to the latest year for all indicator data if none of the requested areas have data
        return await queryable
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .OrderByDescending(healthMeasure => healthMeasure.Year)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Select(healthMeasure => new IndicatorDimensionModel
            {
                IndicatorId = healthMeasure.IndicatorDimension.IndicatorId,
                IndicatorKey = healthMeasure.IndicatorKey,
                Name = healthMeasure.IndicatorDimension.Name,
                Polarity = healthMeasure.IndicatorDimension.Polarity,
                BenchmarkComparisonMethod = healthMeasure.IndicatorDimension.BenchmarkComparisonMethod,
                LatestYear = healthMeasure.Year,
                CollectionFrequency = healthMeasure.IndicatorDimension.CollectionFrequency
            })
            .Take(1)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync
    (
        int indicatorId,
        string[] areaCodes,
        int[] years,
        string[] inequalities,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false
    )
    {
        var excludeDisaggregatedDeprivationValues = !inequalities.Contains(DEPRIVATION);

        DateTime? toDateTime = toDate != null ? toDate.Value.ToDateTime(TimeOnly.MinValue) : null;
        DateTime? fromDateTime = fromDate != null ? fromDate.Value.ToDateTime(TimeOnly.MinValue) : null;
        var healthMeasures = await _dbContext.GetHealthMeasures(includeUnpublished)
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(HealthDataPredicates.IsInAreaCodes(areaCodes))
            .Where(healthMeasure => years.Length == 0 || EF.Constant(years).Contains(healthMeasure.Year))
            .Where(healthMeasure => fromDate == null || healthMeasure.FromDateDimension.Date >= fromDateTime)
            .Where(healthMeasure => toDate == null || healthMeasure.ToDateDimension.Date <= toDateTime)
            .Where(healthMeasure =>
                !excludeDisaggregatedDeprivationValues || healthMeasure.IsDeprivationAggregatedOrSingle)
            .Include(healthMeasure => healthMeasure.AreaDimension)
            .Include(healthMeasure => healthMeasure.AgeDimension)
            .Include(healthMeasure => healthMeasure.PeriodDimension)
            .Include(healthMeasure => healthMeasure.ToDateDimension)
            .Include(healthMeasure => healthMeasure.FromDateDimension)
            .Include(healthMeasure => healthMeasure.SexDimension)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Include(healthMeasure => healthMeasure.DeprivationDimension)
            .Include(healthMeasure => healthMeasure.TrendDimension)
            .OrderBy(healthMeasure => healthMeasure.FromDateDimension.Date)
            .AsNoTracking()
            .ToListAsync();

        foreach (var healthMeasure in healthMeasures)
        {
            healthMeasure.AgeDimension.IsAggregate = healthMeasure.IsAgeAggregatedOrSingle;
            healthMeasure.SexDimension.IsAggregate = healthMeasure.IsSexAggregatedOrSingle;
            healthMeasure.DeprivationDimension.IsAggregate = healthMeasure.IsDeprivationAggregatedOrSingle;
        }

        return healthMeasures;
    }

    public async Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes)
    {
        return await _dbContext.AreaDimension
            .Where(areaDimension => EF.Constant(areaCodes).Contains(areaDimension.Code))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<bool> DeleteAllHealthMeasureByBatchIdAsync(int indicatorId, string batchId)
    {
        var batchToDelete = _dbContext.HealthMeasure
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(healthMeasure => healthMeasure.BatchId == batchId);

        var batchToDeleteFirstEntry = await batchToDelete.FirstOrDefaultAsync();
        if (batchToDeleteFirstEntry == null) return false;

        if (batchToDeleteFirstEntry.PublishedAt <= DateTime.UtcNow)
        {
            throw new InvalidOperationException("Error attempting to delete published batch.");
        }

        var deletedRows = await batchToDelete.ExecuteDeleteAsync();
        return deletedRows > 0;
    }

    public async Task<IEnumerable<DenormalisedHealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync
    (
        int indicatorId,
        string[] areaCodes,
        int[] years,
        string areaTypeKey,
        string benchmarkAreaCode,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false
    )
    {
        SqlParameter areasOfInterest;
        SqlParameter yearsOfInterest;
        // Convert the array parameters into DataTables for presentation to the Stored Procedure.
        using (var areaCodesTable = new DataTable())
        {
            ArgumentNullException.ThrowIfNull(areaCodes);
            areaCodesTable.Columns.Add("AreaCode", typeof(string));
            foreach (var area in areaCodes) areaCodesTable.Rows.Add(area);
            areasOfInterest = new SqlParameter("@RequestedAreas", areaCodesTable)
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "AreaCodeList"
            };
        }

        using (var yearsTable = new DataTable())
        {
            ArgumentNullException.ThrowIfNull(years);
            yearsTable.Columns.Add("YearNum", typeof(int));
            foreach (var item in years) yearsTable.Rows.Add(item);
            yearsOfInterest = new SqlParameter("@RequestedYears", yearsTable)
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "YearList"
            };
        }

        var areaTypeOfInterest = new SqlParameter("@RequestedAreaType", areaTypeKey);
        var requestedIndicatorId = new SqlParameter("@RequestedIndicatorId", indicatorId);
        var requestedBenchmarkAreaCode = new SqlParameter("@RequestedBenchmarkAreaCode", benchmarkAreaCode);

        var requestedFromDate = new SqlParameter("@RequestedFromDate", fromDate.HasValue ? fromDate.Value : DBNull.Value);
        var requestedToDate = new SqlParameter("@RequestedToDate", toDate.HasValue ? toDate.Value : DBNull.Value);
        var includeUnpublishedData = new SqlParameter("@IncludeUnpublishedData", includeUnpublished);

        var denormalisedHealthData = await _dbContext.DenormalisedHealthMeasure.FromSqlInterpolated
        (@$"
              EXEC dbo.GetIndicatorDetailsWithQuintileBenchmarkComparison @RequestedAreas={areasOfInterest}, @RequestedAreaType={areaTypeOfInterest}, @RequestedYears={yearsOfInterest}, @RequestedIndicatorId={requestedIndicatorId}, @RequestedBenchmarkAreaCode={requestedBenchmarkAreaCode}, @RequestedFromDate={requestedFromDate}, @RequestedToDate={requestedToDate}, @IncludeUnpublishedData={includeUnpublishedData}
              "
        ).ToListAsync();

        return denormalisedHealthData.OrderBy(a => a.Year);
    }

    public async Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync
    (
        IEnumerable<int> indicatorIds,
        string areaCode,
        string areaTypeKey,
        string ancestorCode,
        string benchmarkAreaCode,
        bool includeUnpublished = false
    )
    {
        SqlParameter requestedIndicators;
        // Convert the array parameters into DataTables for presentation to the Stored Procedure.
        using (var indicatorIdTable = new DataTable())
        {
            ArgumentNullException.ThrowIfNull(indicatorIds);
            indicatorIdTable.Columns.Add("IndicatorId", typeof(int));
            foreach (var indicator in indicatorIds) indicatorIdTable.Rows.Add(indicator);

            requestedIndicators = new SqlParameter("@RequestedIndicators", indicatorIdTable)
            {
                SqlDbType = SqlDbType.Structured,
                TypeName = "IndicatorList"
            };
        }

        var areaType = new SqlParameter("@RequestedAreaType", areaTypeKey);
        var areaCodeSqlParam = new SqlParameter("@RequestedArea", areaCode);
        var ancestorCodeSqlParam = new SqlParameter("@RequestedAncestorCode", ancestorCode);
        var benchmarkAreaCodeSqlParam = new SqlParameter("@RequestedBenchmarkCode", benchmarkAreaCode);
        var includeUnpublishedData = new SqlParameter("@IncludeUnpublishedData", includeUnpublished);

        var retVal = await _dbContext.QuartileData.FromSql
        (@$"
              EXEC dbo.GetIndicatorQuartileDataForLatestYear @RequestedAreaType={areaType}, @RequestedIndicatorIds={requestedIndicators}, @RequestedArea={areaCodeSqlParam}, @RequestedAncestorCode={ancestorCodeSqlParam}, @RequestedBenchmarkCode={benchmarkAreaCodeSqlParam}, @IncludeUnpublishedData={includeUnpublishedData}
              "
        ).ToListAsync();

        return retVal;
    }
}