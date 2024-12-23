using DHSC.FingertipsNext.Modules.Core.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DHSC.FingertipsNext.Modules.Core.Repository;

public class Repository : IRepository
{
    private readonly HealthMeasureDbContext _dbContext;

    public Repository(HealthMeasureDbContext healthMeasureDbContext)
    {
        _dbContext = healthMeasureDbContext ?? throw new ArgumentNullException(nameof(healthMeasureDbContext));
    }

    public HealthMeasure? GetFirstHealthMeasure()
    {
        return _dbContext.HealthMeasure.OrderBy(hm => hm.HealthMeasureKey)
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.AgeDimension)
            .First();
    }
}