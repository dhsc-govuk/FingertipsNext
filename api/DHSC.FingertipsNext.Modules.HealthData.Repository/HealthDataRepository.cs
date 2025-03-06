using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class HealthDataRepository(HealthDataDbContext healthDataDbContext) : IHealthDataRepository
{
    private readonly HealthDataDbContext _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => inequalities.Contains("sex") ? true: hm.SexDimension.HasValue == false)
            .Where(hm => inequalities.Contains("age") ? true: hm.AgeDimension.HasValue == false)
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.AgeDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Select(x => new HealthMeasureModel()
                {
                    Year = x.Year,
                    Value = x.Value,
                    Count = x.Count,
                    LowerCi =x.LowerCi,
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
                    TrendDimension = new TrendDimensionModel() {
                        Name = x.TrendDimension.Name
                    }
                })
            .AsNoTracking()
            .ToListAsync();
    }
}
