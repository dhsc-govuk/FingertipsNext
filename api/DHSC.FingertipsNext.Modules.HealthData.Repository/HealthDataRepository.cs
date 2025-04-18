using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using System.Data;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private const string SEX = "sex";
    private const string AGE = "age";
    private const string DEPRIVATION = "deprivation";

    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    public async Task<IndicatorDimensionModel> GetIndicatorDimensionAsync(int indicatorId)
    {
        var model = await _dbContext.HealthMeasure
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
       
        return model;
    }
    
    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        var excludeDisaggregatedSexValues = !inequalities.Contains(SEX);
        var excludeDisaggregatedAgeValues = !inequalities.Contains(AGE);
        var excludeDisaggregatedDeprivationValues = !inequalities.Contains(DEPRIVATION);

        return await _dbContext.HealthMeasure
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(healthMeasure => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(healthMeasure.AreaDimension.Code))
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

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int indicatorId, string[] areaCodes, int[] years, string areaTypeKey)
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

        var denormalisedHealthData = await _dbContext.DenormalisedHealthMeasure.FromSql
            (@$"
              EXEC dbo.GetIndicatorDetailsWithQuintileBenchmarkComparison @RequestedAreas={areasOfInterest}, @RequestedAreaType={areaTypeOfInterest}, @RequestedYears={yearsOfInterest}, @RequestedIndicatorId={requestedIndicatorId}
              "
            ).ToListAsync();

        return [.. denormalisedHealthData
            .Select(a => a.Normalise())
            .OrderBy(a => a.Year)];
    }

    public async Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode, string areaTypeKey, string ancestorCode)
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
        var AncestorCode = new SqlParameter("@RequestedAncestorCode", ancestorCode);

        var retVal = await _dbContext.QuartileData.FromSql
            (@$"
              EXEC dbo.GetIndicatorQuartileDataForLatestYear @RequestedAreaType={AreaType}, @RequestedIndicatorIds={RequestedIndicators}, @RequestedArea={AreaCode}, @RequestedAncestor={AncestorCode}
              "
            ).ToListAsync();

        return retVal;
    }

}
