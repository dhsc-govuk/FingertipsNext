using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository(HealthMeasureDbContext dbCtx)
{
    private readonly HealthMeasureDbContext _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));

    public async Task<IEnumerable<HealthMeasureModel>> GetByIndicator(int indicatorKey) {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension == null || hm.IndicatorDimension.IndicatorKey == indicatorKey)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Select(x => new HealthMeasureModel()
            {
                Year = x.Year,
                Value = x.Value,
                Count = x.Count,
                Denominator = x.Denominator,
                LowerCI = x.LowerCI,
                UpperCI = x.UpperCI,
                HealthMeasureKey = x.HealthMeasureKey,
                AgeKey = x.AgeKey,
                AreaKey = x.AreaKey,
                DeprivationKey = x.DeprivationKey,
                IndicatorKey = x.IndicatorKey,
                SexKey = x.SexKey,
                TrendKey = x.TrendKey,
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                }
            })
            .ToListAsync();
    }

    public void UpdateTrendKey(HealthMeasureModel healthMeasure, byte newTrendKey) {
        healthMeasure.TrendKey = newTrendKey;
        _dbContext.Entry(healthMeasure).State = EntityState.Modified;
    }

    public async Task SaveChanges() {
        _dbContext.ChangeTracker.DetectChanges();
        await _dbContext.SaveChangesAsync();
        _dbContext.ChangeTracker.Clear();
    }
}
