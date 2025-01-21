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

    public async Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId, string[] areaCodes, int[] years)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .OrderBy(hm => hm.Year)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.IndicatorDimension)
            .ToListAsync();
    }
}