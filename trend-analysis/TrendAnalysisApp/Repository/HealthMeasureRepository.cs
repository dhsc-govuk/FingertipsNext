using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository(HealthMeasureDbContext dbCtx)
{
    private readonly HealthMeasureDbContext _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));

    public async Task<IEnumerable<HealthMeasureModel>> GetByIndicator(int indicatorKey)
    {
        return await _dbContext.HealthMeasure
            .Where(hm => hm.IndicatorDimension == null || hm.IndicatorDimension.IndicatorKey == indicatorKey)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.TrendDimension)
            .Select(x => new HealthMeasureModel()
            {
                FromDateDimension = new DateDimensionModel()
                {
                    Date = x.FromDateDimension.Date
                },
                ToDateDimension = new DateDimensionModel()
                {
                    Date = x.ToDateDimension.Date
                },
                PeriodDimension = new PeriodDimensionModel()
                {
                    Period = x.PeriodDimension.Period,
                },
                Value = x.Value,
                Count = x.Count,
                Denominator = x.Denominator,
                LowerCI = x.LowerCI,
                UpperCI = x.UpperCI,
                IsAgeAggregatedOrSingle = x.IsAgeAggregatedOrSingle,
                IsDeprivationAggregatedOrSingle = x.IsDeprivationAggregatedOrSingle,
                IsSexAggregatedOrSingle = x.IsSexAggregatedOrSingle,
                HealthMeasureKey = x.HealthMeasureKey,
                AgeKey = x.AgeKey,
                AreaKey = x.AreaKey,
                AreaDimension = new AreaDimensionModel()
                {
                    Code = x.AreaDimension.Code
                },
                DeprivationKey = x.DeprivationKey,
                IndicatorKey = x.IndicatorKey,
                SexKey = x.SexKey,
                TrendKey = x.TrendKey,
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                },
                BatchId = x.BatchId,
                PublishedAt = x.PublishedAt
            })
            .ToListAsync();
    }

    public void UpdateTrendKey(HealthMeasureModel healthMeasure, byte newTrendKey)
    {
        // Avoids registering an update in unlikely scenario where trend analysis is being rerun
        if (healthMeasure.TrendKey != newTrendKey)
        {
            healthMeasure.TrendKey = newTrendKey;
            _dbContext.Entry(healthMeasure).State = EntityState.Modified;
        }
    }

    public async Task SaveChanges()
    {
        _dbContext.ChangeTracker.DetectChanges();
        await _dbContext.SaveChangesAsync();
        _dbContext.ChangeTracker.Clear();
    }
}
