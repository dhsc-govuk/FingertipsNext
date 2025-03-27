using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

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
        var results = await _dbContext.IndicatorDimension
            .Where(i => i.IndicatorId == indicatorId)
            .Select(x => new IndicatorDimensionModel()
            {
                IndicatorId = x.IndicatorId,
                IndicatorKey = x.IndicatorKey,
                Name = x.Name,
                StartDate = x.StartDate,
                EndDate = x.EndDate,
                Polarity = x.Polarity,
                BenchmarkComparisonMethod = x.BenchmarkComparisonMethod,
            })
            .ToListAsync();
        return results.FirstOrDefault();
    }
    
    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        var excludeDisaggregatedSexValues = !inequalities.Contains(SEX);
        var excludeDisaggregatedAgeValues = !inequalities.Contains(AGE);
        var excludeDisaggregatedDeprivationValues = !inequalities.Contains(DEPRIVATION);

        return await _dbContext.HealthMeasure
            .Where(healthMeasure => healthMeasure.IndicatorDimension.IndicatorId == indicatorId)
            .Where(healthMeasure => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(healthMeasure.AreaDimension.Code))
            .Where(healthMeasure => years.Length == 0 || years.Contains(healthMeasure.Year))
            .Where(healthMeasure => excludeDisaggregatedSexValues ? healthMeasure.IsSexAggregatedOrSingle : true)
            .Where(healthMeasure => excludeDisaggregatedAgeValues ? healthMeasure.IsAgeAggregatedOrSingle : true)
            .Where(healthMeasure => excludeDisaggregatedDeprivationValues ? healthMeasure.IsDeprivationAggregatedOrSingle : true)
            .OrderBy(healthMeasure => healthMeasure.Year)
            .Include(healthMeasure => healthMeasure.AreaDimension)
            .Include(healthMeasure => healthMeasure.AgeDimension)
            .Include(healthMeasure => healthMeasure.SexDimension)
            .Include(healthMeasure => healthMeasure.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
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
                },
                SexDimension = new SexDimensionModel
                {
                    Name = healthMeasure.SexDimension.Name,
                    HasValue = healthMeasure.SexDimension.HasValue
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
                    HasValue = healthMeasure.DeprivationDimension.HasValue
                },
                IsAggregate = healthMeasure.IsAgeAggregatedOrSingle && healthMeasure.IsSexAggregatedOrSingle && healthMeasure.IsDeprivationAggregatedOrSingle
            })
            .AsNoTracking()
            .ToListAsync();
    }
}
