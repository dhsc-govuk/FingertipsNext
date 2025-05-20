using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private const string ENGLAND_AREA_CODE = "E92000001";
    private const string SEX = "sex";
    private const string AGE = "age";
    private const string DEPRIVATION = "deprivation";

    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    /// <summary>
    /// Will retrieve the indicator dimension data for the requested indicator ID while also
    /// obtaining the latest year that data is available for the indicator based on the area codes provided.
    /// 
    /// Note: both in terms of intent and performance this is sub-optimal and should be refactored at the earliest opportunity
    /// post-POC under DHSCFT-678.
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
        
        if (model != null) {
            return model;
        }

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
    
    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
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
            .Where(healthMeasure => excludeDisaggregatedDeprivationValues ? healthMeasure.IsDeprivationAggregatedOrSingle : true)
            .OrderBy(healthMeasure => healthMeasure.Year)
            .Include(healthMeasure => healthMeasure.AreaDimension)
            .Include(healthMeasure => healthMeasure.AgeDimension)
            .Include(healthMeasure => healthMeasure.SexDimension)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Include(healthMeasure => healthMeasure.DeprivationDimension)
            .Select(healthMeasure => new HealthMeasureModel
            {
                Year = healthMeasure.Year,
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
                    Name = healthMeasure.IndicatorDimension.Name,
                },
                AreaDimension = new AreaDimensionModel
                {
                    Code = healthMeasure.AreaDimension.Code,
                    Name = healthMeasure.AreaDimension.Name,
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
                IsAggregate = healthMeasure.IsAgeAggregatedOrSingle && healthMeasure.IsSexAggregatedOrSingle && healthMeasure.IsDeprivationAggregatedOrSingle
            })
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes) =>
        await _dbContext.AreaDimension
            .Where(areaDimension => EF.Constant(areaCodes).Contains(areaDimension.Code))
            .AsNoTracking()
            .ToListAsync();

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int indicatorId, string[] areaCodes, int[] years, string areaTypeKey, string benchmarkAreaCode)
    {
        // Convert the array parameters into DataTables for presentation to the Stored Procedure.
        var AreaCodesTable = new DataTable();
        AreaCodesTable.Columns.Add("AreaCode", typeof(string));
        foreach (var area in areaCodes)
        {
            AreaCodesTable.Rows.Add(area);
        }
        var areasOfInterest = new SqlParameter("@RequestedAreas", AreaCodesTable)
        {
            SqlDbType = SqlDbType.Structured,
            TypeName = "AreaCodeList"
        };

        var YearsTable = new DataTable();
        YearsTable.Columns.Add("YearNum", typeof(int));
        foreach (var item in years)
        {
            YearsTable.Rows.Add(item);
        }
        var yearsOfInterest = new SqlParameter("@RequestedYears", YearsTable)
        {
            SqlDbType = SqlDbType.Structured,
            TypeName = "YearList"
        };

        var areaTypeOfInterest = new SqlParameter("@RequestedAreaType", areaTypeKey);
        var requestedIndicatorId = new SqlParameter("@RequestedIndicatorId", indicatorId);
        var requestedBenchmarkAreaCode = new SqlParameter("@RequestedBenchmarkAreaCode", benchmarkAreaCode);

        var denormalisedHealthData = await _dbContext.DenormalisedHealthMeasure.FromSql
            (@$"
              EXEC dbo.GetIndicatorDetailsWithQuintileBenchmarkComparison @RequestedAreas={areasOfInterest}, @RequestedAreaType={areaTypeOfInterest}, @RequestedYears={yearsOfInterest}, @RequestedIndicatorId={requestedIndicatorId}, @RequestedBenchmarkAreaCode={requestedBenchmarkAreaCode}
              "
            ).ToListAsync();

        return [.. denormalisedHealthData
            .Select(a => a.Normalise())
            .OrderBy(a => a.Year)];
    }

    public async Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode, string areaTypeKey, string areaGroup, string benchmarkAreaCode)
    {
        // Convert the array parameters into DataTables for presentation to the Stored Procedure.
        var IndicatorIdTable = new DataTable();
        IndicatorIdTable.Columns.Add("IndicatorId", typeof(int));
        foreach (var indicator in indicatorIds)
        {
            IndicatorIdTable.Rows.Add(indicator);
        }

        var RequestedIndicators = new SqlParameter("@RequestedIndicators", IndicatorIdTable)
        {
            SqlDbType = SqlDbType.Structured,
            TypeName = "IndicatorList"
        };

        var AreaType = new SqlParameter("@RequestedAreaType", areaTypeKey);
        var AreaCode = new SqlParameter("@RequestedArea", areaCode);
        var AncestorCode = new SqlParameter("@RequestedAncestorCode", areaGroup);
        var BenchmarkAreaCode = new SqlParameter("@RequestedBenchmarkCode", benchmarkAreaCode);

        var retVal = await _dbContext.QuartileData.FromSql
            (@$"
              EXEC dbo.GetIndicatorQuartileDataForLatestYear @RequestedAreaType={AreaType}, @RequestedIndicatorIds={RequestedIndicators}, @RequestedArea={AreaCode}, @RequestedAncestorCode={AncestorCode}, @RequestedBenchmarkCode={BenchmarkAreaCode}
              "
            ).ToListAsync();

        return retVal;
    }
}
