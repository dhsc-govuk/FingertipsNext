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

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        var excludeDisaggregatedSexValues = !inequalities.Contains(SEX);
        var excludeDisaggregatedAgeValues = !inequalities.Contains(AGE);
        var excludeDisaggregatedDeprivationValues = !inequalities.Contains(DEPRIVATION);

        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => excludeDisaggregatedSexValues ? hm.IsSexAggregatedOrSingle:true)
            .Where(hm => excludeDisaggregatedAgeValues ? hm.IsAgeAggregatedOrSingle : true)
            .Where(hm => excludeDisaggregatedDeprivationValues ? hm.IsDeprivationAggregatedOrSingle : true)
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.AgeDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Include(hm => hm.DeprivationDimension)
            .Select(hm => new HealthMeasureModel()
            {
                Year = hm.Year,
                Value = hm.Value,
                Count = hm.Count,
                LowerCi = hm.LowerCi,
                UpperCi = hm.UpperCi,
                AgeDimension = new AgeDimensionModel()
                {
                    Name = hm.AgeDimension.Name,
                    HasValue = hm.AgeDimension.HasValue,
                },
                SexDimension = new SexDimensionModel()
                {
                    Name = hm.SexDimension.Name,
                    HasValue = hm.SexDimension.HasValue
                },
                IndicatorDimension = new IndicatorDimensionModel()
                {
                    Name = hm.IndicatorDimension.Name,
                },
                AreaDimension = new AreaDimensionModel()
                {
                    Code = hm.AreaDimension.Code,
                    Name = hm.AreaDimension.Name,
                },
                TrendDimension = new TrendDimensionModel()
                {
                    Name = hm.TrendDimension.Name
                },
                DeprivationDimension = new DeprivationDimensionModel()
                {
                    Name = hm.DeprivationDimension.Name,
                    Type = hm.DeprivationDimension.Type,
                    Sequence = hm.DeprivationDimension.Sequence,
                    HasValue = hm.DeprivationDimension.HasValue
                },
                IsAggregate =hm.IsAgeAggregatedOrSingle && hm.IsSexAggregatedOrSingle && hm.IsDeprivationAggregatedOrSingle
            })
            .AsNoTracking()
            .ToListAsync();
    }
}
