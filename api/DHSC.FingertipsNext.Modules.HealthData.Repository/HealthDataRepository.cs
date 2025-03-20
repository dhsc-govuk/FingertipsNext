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
            .Select(x => new HealthMeasureModel()
            {
                Year = x.Year,
                Value = x.Value,
                Count = x.Count,
                LowerCi = x.LowerCi,
                UpperCi = x.UpperCi,
                AgeDimension = new AgeDimensionModel()
                {
                    Name = x.AgeDimension.Name,
                    HasValue = x.AgeDimension.HasValue,
                },
                SexDimension = new SexDimensionModel()
                {
                    Name = x.SexDimension.Name,
                    HasValue = x.SexDimension.HasValue
                },
                IndicatorDimension = new IndicatorDimensionModel()
                {
                    Name = x.IndicatorDimension.Name,
                },
                AreaDimension = new AreaDimensionModel()
                {
                    Code = x.AreaDimension.Code,
                    Name = x.AreaDimension.Name,
                },
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                },
                DeprivationDimension = new DeprivationDimensionModel()
                {
                    Name = x.DeprivationDimension.Name,
                    Type = x.DeprivationDimension.Type,
                    Sequence = x.DeprivationDimension.Sequence,
                    HasValue = x.DeprivationDimension.HasValue
                }
            })
            .AsNoTracking()
            .ToListAsync();
    }
}
