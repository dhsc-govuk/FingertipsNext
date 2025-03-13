using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

[SuppressMessage("ReSharper", "SimplifyConditionalTernaryExpression")]
public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        var countInequalityDimensionsQuery = _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Include(hm => hm.IndicatorDimension)
            .GroupBy(x => x.IndicatorKey)
            .Select(x => new { 
                SexKeyCount = x.Select(hm => hm.SexKey).Distinct().Count(),
                AgeKeyCount = x.Select(hm => hm.AgeKey).Distinct().Count(),
                DeprivationKeyCount = x.Select(hm => hm.DeprivationKey).Distinct().Count()
            });
        
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || EF.Constant(areaCodes).Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => inequalities.Contains("sex")
                ? true
                : hm.SexDimension.HasValue == false || countInequalityDimensionsQuery.First().SexKeyCount == 1)
            .Where(hm => inequalities.Contains("age")
                ? true
                : hm.AgeDimension.HasValue == false || countInequalityDimensionsQuery.First().AgeKeyCount == 1)
            // TODO: Will be expanded to allow the deprivation dimension to be retrieved based on a query param in DHSCFT-396
            .Where(hm => hm.DeprivationDimension.HasValue == false || countInequalityDimensionsQuery.First().DeprivationKeyCount == 1)
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
