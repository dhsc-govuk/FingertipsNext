using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class HealthMeasureRepository(HealthMeasureDbContext dbCtx)
{
    private readonly HealthMeasureDbContext _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));

    /// <summary>
    /// Retrieves a health measure result set for a given set of dimensions.
    /// e.g. for an indicator with given dimensions for age group, area and sex.
    /// </summary>
    /// <param name="ageId"></param>
    /// <param name="areaCode"></param>
    /// <param name="indicatorId"></param>
    /// <param name="sexId"></param>
    /// <returns>A health measure result set entity</returns>
    public async Task<IEnumerable<HealthMeasureModel>> GetForUniqueDimension(
        int ageId,
        string areaCode,
        int indicatorId,
        int sexId
    ) {
            return await _dbContext.HealthMeasure
            .Where(hm => hm.AgeDimension == null || hm.AgeDimension.AgeID == ageId)
            .Where(hm => hm.AreaDimension == null || hm.AreaDimension.Code == areaCode)
            .Where(hm => hm.IndicatorDimension == null || hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => hm.SexDimension == null || hm.SexDimension.SexId == sexId)
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
                    Name = x.TrendDimension.Name,
                    HasValue = x.TrendDimension.HasValue
                }
            })
            .ToListAsync();
    }
}
