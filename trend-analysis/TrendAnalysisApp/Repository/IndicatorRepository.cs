using Microsoft.EntityFrameworkCore;
using TrendAnalysisApp.Repository.Models;

namespace TrendAnalysisApp.Repository;

public class IndicatorRepository(HealthMeasureDbContext dbCtx) : IIndicatorRepository
{
    private readonly HealthMeasureDbContext _dbContext = dbCtx ?? throw new ArgumentNullException(nameof(dbCtx));

    public async Task<IEnumerable<IndicatorDimensionModel>> GetAll() {
        return await _dbContext.IndicatorDimension.ToListAsync();
    }
}
