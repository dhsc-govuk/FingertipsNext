using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public class HealthDataRepository : IRepository
{
    private readonly HealthDataDbContext _dbContext;

    public HealthDataRepository(HealthDataDbContext healthDataDbContext)
    {
        _dbContext = healthDataDbContext ?? throw new ArgumentNullException(nameof(healthDataDbContext));
    }

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years, string[] inequalities)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Where(hm => inequalities.Contains("sex") || !hm.SexDimension.HasValue)
            .Where(hm => inequalities.Contains("age") || !hm.AgeDimension.HasValue)
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.AgeDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.IndicatorDimension)
            .ToListAsync();
    }
}