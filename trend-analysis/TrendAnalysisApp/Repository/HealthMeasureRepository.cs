using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository
{
    private readonly HealthMeasureDbContext _dbContext;

    // Pre-compile the query (this gets compiled once per application lifetime)
    private static readonly Func<HealthMeasureDbContext, int, Task<List<HealthMeasureModel>>> _compiledGetByIndicatorQuery =
        EF.CompileAsyncQuery((HealthMeasureDbContext context, int indicatorKey) =>
            context.HealthMeasure
                .AsNoTracking()  // if this query is read-only
                .Where(hm => hm.IndicatorDimension == null || hm.IndicatorDimension.IndicatorKey == indicatorKey)
                .Select(x => new HealthMeasureModel
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
                    TrendDimension = new TrendDimensionModel
                    {
                        Name = x.TrendDimension.Name
                    }
                }).ToList());

    public HealthMeasureRepository(HealthMeasureDbContext dbCtx)
    {
        _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));
    }

    public Task<List<HealthMeasureModel>> GetByIndicator(int indicatorKey)
    {
        // Use the compiled query here.
        return _compiledGetByIndicatorQuery(_dbContext, indicatorKey);
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
