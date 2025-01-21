using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

/// <summary>
///
/// </summary>
public class AreaRepository : IAreaRepository
{
    private readonly AreaRepositoryDbContext _dbContext;

    /// <summary>
    ///
    /// </summary>
    /// <param name="dbContext"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public AreaRepository(AreaRepositoryDbContext dbContext)
    {
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));
    }

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    public async Task<string[]> GetHierarchiesAsync()
    {
        var hierarchies = await _dbContext
            .Area.Select(h => h.HierarchyType)
            .Distinct()
            .ToArrayAsync();

        return hierarchies;
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public async Task<string[]> GetAreaTypesAsync(string? hierarchyType)
    {
        if (string.IsNullOrEmpty(hierarchyType))
        {
            return await _dbContext.Area.Select(am => am.AreaType).Distinct().ToArrayAsync();
        }

        return await _dbContext
            .Area.Where(am => am.HierarchyType == hierarchyType)
            .Select(am => am.AreaType)
            .Distinct()
            .ToArrayAsync();
    }

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including
    /// its children and ancestors.
    /// </summary>
    /// <param name="areaCode">The area code of the area/geography</param>
    /// <param name="includeChildren">Optionally, include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="includeAncestors">Optionally, include the ancestor areas.</param>
    /// <param name="childAreaType">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns>The requested area node, or null if it cannot be located.</returns>
    public async Task<AreaWithRelationsModel?> GetAreaAsync(
        string areaCode,
        bool includeChildren,
        bool includeAncestors,
        string? childAreaType
    )
    {
        var area = await _dbContext
            .Area.Where(area => area.AreaCode == areaCode)
            .FirstOrDefaultAsync();

        if (area == null)
            return null;

        var aresWithRelations = new AreaWithRelationsModel { Area = area };

        var parentNodeId = area.Node.GetAncestor(1);
        var parent = await _dbContext.Area.Where(a => a.Node == parentNodeId).FirstOrDefaultAsync();

        if (parent != null)
        {
            aresWithRelations.ParentArea = parent;
        }
        
        if (includeChildren)
        {
            if (string.IsNullOrWhiteSpace(childAreaType))
            {
                // direct children
                var directChildren = await _dbContext.Area
                    .Where(a => a.Node.GetAncestor(1) == area.Node)
                    .ToListAsync();

                aresWithRelations.Children = directChildren.ToArray();
            }
            else
            {
                // children lower down the hierarchy
                var singleChildOfType = await _dbContext.Area
                    .Where(a => a.AreaType == childAreaType)
                    .FirstOrDefaultAsync();

                if (singleChildOfType != null)
                {
                    int parentLevel = area.Level;

                    var distantChildren = await _dbContext.Area
                        .Where(a => a.Node.GetAncestor(singleChildOfType.Level - parentLevel) == area.Node)
                        .ToListAsync();

                    aresWithRelations.Children = distantChildren.ToArray();
                }
            }
        }

        if (includeAncestors)
        {
            var ancestors = await _dbContext
                .Area.FromSqlInterpolated(
                    $"""
                    --given an areacode return the children that are of a defined area type
                                    
                    DECLARE @areacode nvarchar(50)
                    SET @areacode={areaCode}

                    DECLARE @areatype nvarchar(50)
                    SET @areatype={childAreaType}

                    --get the level of the parent
                    DECLARE @parentlevel smallint =(SELECT [Level] FROM [Areas].[Areas] WHERE AreaCode=@areacode)
                    DECLARE @myarea hierarchyid = (SELECT Node FROM [Areas].[Areas] WHERE AreaCode = @areacode )

                    --GET the level of the areatype we are looking for
                    DECLARE @level smallint =(SELECT top 1 [Level] FROM [Areas].[Areas] WHERE AreaType=@areatype)

                    --use the get ancestor functor with a variable level based on the difference between the things we are looking for and the group
                    SELECT
                        *
                    FROM
                        [Areas].[Areas]
                    WHERE
                        Node.GetAncestor(@level - @parentlevel) = @myarea
                    """
                )
                .ToListAsync();
        }

        return aresWithRelations;
    }

    public async Task<AreaModel?> GetRootAreaAsync()
    {
        var rootArea = await _dbContext
            .Area.Where(a => a.Node == HierarchyId.GetRoot())
            .FirstOrDefaultAsync();

        return rootArea;
    }
}
