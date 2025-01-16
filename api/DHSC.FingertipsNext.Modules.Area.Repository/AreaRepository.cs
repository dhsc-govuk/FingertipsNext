using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepository: IAreaRepository
{
    private readonly AreaRepositoryDbContext _dbContext;

    public AreaRepository(AreaRepositoryDbContext dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }

    /*
     * [FromRoute] string areaCode,
        [FromQuery] bool? includeChildren = null,
        [FromQuery] bool? includeAncestors = null,
        [FromQuery] string? child_area_type = null
     */
    public async Task<IReadOnlyCollection<AreaDimensionModel>> GetAreaData(string areaCode)
    {
        return await _dbContext.AreaDimension
            .Where(ad => ad.Code == areaCode)
            .OrderBy(ad => ad.Code)
            .ToListAsync();
    }    
}