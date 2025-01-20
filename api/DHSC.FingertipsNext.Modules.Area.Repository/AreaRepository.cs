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
//    public async Task<IReadOnlyCollection<AreaDimensionModel>> GetAreaData(string areaCode)
    public async Task<IReadOnlyCollection<AreaModel>> GetAreaData(string areaCode)
    {
        return await _dbContext.Area.
        FromSql($"""
                --Children of England (no that's not a 60's folk band) - shoud be both admin and NHS hierarchies
                --first set the @rootnode variable to the root node value using the built-in static GetRoot() function
                DECLARE @rootnode hierarchyid  = (SELECT  Node FROM areas.areas WHERE Node = hierarchyid::GetRoot())
                
                -- get all the rows that have a direct ancestor of the root node using the built-in GetAncestor function
                SELECT
                    *
                FROM
                    areas.areas
                WHERE
                    Node.GetAncestor(1) = @rootnode
                
                --Top level nodes just in NHS hierarchy
                SELECT
                    *
                FROM
                    areas.areas
                WHERE
                    Node.GetAncestor(1) = @rootnode
                  AND
                    HierarchyType ='NHS'
                """)
            .ToListAsync();
        
        // return await _dbContext.AreaDimension
        //     .Where(ad => ad.Code == areaCode)
        //     .OrderBy(ad => ad.Code)
        //     .ToListAsync();
    }    
}