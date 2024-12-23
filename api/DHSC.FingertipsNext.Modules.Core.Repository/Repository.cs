using DHSC.FingertipsNext.Modules.Core.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Core.Repository;

public class Repository : IRepository
{
    private readonly HealthMeasureDbContext _dbContext;

    public Repository(HealthMeasureDbContext healthMeasureDbContext)
    {
        _dbContext = healthMeasureDbContext ?? throw new ArgumentNullException(nameof(healthMeasureDbContext));
    }

    public IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string[]areaCodes, short[]years)
    {
        return _dbContext.HealthMeasure.OrderBy(hm => hm.Year)
            .Where(hm => hm.IndicatorDimension.IndicatorId == indicatorId)
            .Where(hm => areaCodes.Length == 0 || areaCodes.Contains(hm.AreaDimension.Code))
            .Where(hm => years.Length == 0 || years.Contains(hm.Year))
            .Include(hm => hm.AreaDimension)
            .Include(hm => hm.IndicatorDimension)
            .Include(hm => hm.SexDimension)
            .Include(hm => hm.AgeDimension);
    }
}