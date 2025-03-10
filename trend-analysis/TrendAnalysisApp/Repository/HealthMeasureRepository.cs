using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository(HealthMeasureDbContext dbCtx)
{
    private readonly HealthMeasureDbContext _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));

    /// <summary>
    /// Retrieves the 5 most recent health measure results for an indicator associated with a given area.
    /// Currently, we will only calculate trends for HealthMeasures associated with all ages and all sexes.
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="indicatorKey"></param>
    /// <returns>A list of Health Measure Models</returns>
    public async Task<IEnumerable<HealthMeasureModel>> GetForUniqueDimension(
        string areaCode,
        int indicatorKey
    ) {
            return await _dbContext.HealthMeasure
            .Where(hm => hm.AgeDimension == null || hm.AgeDimension.HasValue == false)
            .Where(hm => hm.AreaDimension == null || hm.AreaDimension.Code == areaCode)
            .Where(hm => hm.IndicatorDimension == null || hm.IndicatorDimension.IndicatorKey == indicatorKey)
            .Where(hm => hm.SexDimension == null || hm.SexDimension.HasValue == false)
            .OrderByDescending(hm => hm.Year)
            .Take(5)
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
                LowerCI = x.LowerCI,
                UpperCI = x.UpperCI,
                AgeDimension = new AgeDimensionModel()
                {
                    AgeID = x.AgeDimension.AgeID
                },
                AreaDimension = new AreaDimensionModel()
                {
                    Code = x.AreaDimension.Code
                },
                IndicatorDimension = new IndicatorDimensionModel()
                {
                    IndicatorId = x.IndicatorDimension.IndicatorId
                },
                SexDimension = new SexDimensionModel()
                {
                    SexId = x.SexDimension.SexId
                },
                TrendDimension = new TrendDimensionModel()
                {
                    Name = x.TrendDimension.Name
                }
            })
            .ToListAsync();
    }
}
