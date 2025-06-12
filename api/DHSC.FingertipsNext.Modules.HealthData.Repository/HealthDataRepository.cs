using System.Data;
using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private const string SEX = "sex";
    private const string AGE = "age";
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
    public async Task<IndicatorDimensionModel> GetIndicatorDimensionAsync(int indicatorId, string[] areaCodes)
    {
        var model = await _dbContext.HealthMeasure
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
                LatestYear = healthMeasure.Year
            })
            .Take(1)
            .FirstOrDefaultAsync();

        if (model != null) return model;

        // Default to the latest year for all indicator data if none of the requested areas have data
        return await _dbContext.HealthMeasure
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
                LatestYear = healthMeasure.Year
            })
            .Take(1)
            .FirstOrDefaultAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes,
        int[] years, string[] inequalities)
    {
        var excludeDisaggregatedSexValues = !inequalities.Contains(SEX);
        var excludeDisaggregatedAgeValues = !inequalities.Contains(AGE);
        var excludeDisaggregatedDeprivationValues = !inequalities.Contains(DEPRIVATION);

        return await _dbContext.HealthMeasure
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(HealthDataPredicates.IsInAreaCodes(areaCodes))
            .Where(healthMeasure => years.Length == 0 || EF.Constant(years).Contains(healthMeasure.Year))
            .Where(healthMeasure => excludeDisaggregatedSexValues ? healthMeasure.IsSexAggregatedOrSingle : true)
            .Where(healthMeasure => excludeDisaggregatedAgeValues ? healthMeasure.IsAgeAggregatedOrSingle : true)
            .Where(healthMeasure =>
                excludeDisaggregatedDeprivationValues ? healthMeasure.IsDeprivationAggregatedOrSingle : true)
            .OrderBy(healthMeasure => healthMeasure.Year)
            .OrderBy(healthMeasure => healthMeasure.ToDateDimension)
            .OrderBy(healthMeasure => healthMeasure.FromDateDimension)
            .Include(healthMeasure => healthMeasure.AreaDimension)
            .Include(healthMeasure => healthMeasure.AgeDimension)
            .Include(healthMeasure => healthMeasure.PeriodDimension)
            .Include(healthMeasure => healthMeasure.ToDateDimension)
            .Include(healthMeasure => healthMeasure.FromDateDimension)
            .Include(healthMeasure => healthMeasure.SexDimension)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Include(healthMeasure => healthMeasure.DeprivationDimension)
            .Select(healthMeasure => new HealthMeasureModel
            {
                Year = healthMeasure.Year,
                PeriodDimension = new PeriodDimensionModel
                {
                    Period = healthMeasure.PeriodDimension.Period
                },
                FromDateDimension = new DateDimensionModel
                {
                    Date = healthMeasure.FromDateDimension.Date
                },
                ToDateDimension = new DateDimensionModel
                {
                    Date = healthMeasure.ToDateDimension.Date
                },
                Value = healthMeasure.Value,
                Count = healthMeasure.Count,
                LowerCi = healthMeasure.LowerCi,
                UpperCi = healthMeasure.UpperCi,
                AgeDimension = new AgeDimensionModel
                {
                    Name = healthMeasure.AgeDimension.Name,
                    HasValue = healthMeasure.AgeDimension.HasValue,
                    IsAggregate = healthMeasure.IsAgeAggregatedOrSingle
                },
                SexDimension = new SexDimensionModel
                {
                    Name = healthMeasure.SexDimension.Name,
                    HasValue = healthMeasure.SexDimension.HasValue,
                    IsAggregate = healthMeasure.IsSexAggregatedOrSingle
                },
                IndicatorDimension = new IndicatorDimensionModel
                {
                    Name = healthMeasure.IndicatorDimension.Name
                },
                AreaDimension = new AreaDimensionModel
                {
                    Code = healthMeasure.AreaDimension.Code,
                    Name = healthMeasure.AreaDimension.Name
                },
                TrendDimension = new TrendDimensionModel
                {
                    Name = healthMeasure.TrendDimension.Name
                },
                DeprivationDimension = new DeprivationDimensionModel
                {
                    Name = healthMeasure.DeprivationDimension.Name,
                    Type = healthMeasure.DeprivationDimension.Type,
                    Sequence = healthMeasure.DeprivationDimension.Sequence,
                    HasValue = healthMeasure.DeprivationDimension.HasValue,
                    IsAggregate = healthMeasure.IsDeprivationAggregatedOrSingle
                },
                IsAggregate = healthMeasure.IsAgeAggregatedOrSingle && healthMeasure.IsSexAggregatedOrSingle &&
                              healthMeasure.IsDeprivationAggregatedOrSingle
            })
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes)
    {
        return await _dbContext.AreaDimension
            .Where(areaDimension => EF.Constant(areaCodes).Contains(areaDimension.Code))
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
        int indicatorId, string[] areaCodes, int[] years, string areaTypeKey, string benchmarkAreaCode)
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

        var denormalisedHealthData = await _dbContext.DenormalisedHealthMeasure.FromSqlInterpolated
        (@$"
              EXEC dbo.GetIndicatorDetailsWithQuintileBenchmarkComparison @RequestedAreas={areasOfInterest}, @RequestedAreaType={areaTypeOfInterest}, @RequestedYears={yearsOfInterest}, @RequestedIndicatorId={requestedIndicatorId}, @RequestedBenchmarkAreaCode={requestedBenchmarkAreaCode}
              "
        ).ToListAsync();

        return
        [
            .. denormalisedHealthData
                .Select(a => a.Normalise())
                .OrderBy(a => a.Year)
        ];
    }

    public async Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds,
        string areaCode, string areaTypeKey, string ancestorCode, string benchmarkAreaCode)
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

        var retVal = await _dbContext.QuartileData.FromSql
        (@$"
              EXEC dbo.GetIndicatorQuartileDataForLatestYear @RequestedAreaType={areaType}, @RequestedIndicatorIds={requestedIndicators}, @RequestedArea={areaCodeSqlParam}, @RequestedAncestorCode={ancestorCodeSqlParam}, @RequestedBenchmarkCode={benchmarkAreaCodeSqlParam}
              "
        ).ToListAsync();

        return retVal;
    }
}