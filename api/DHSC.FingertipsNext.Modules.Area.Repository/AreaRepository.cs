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
            .Area.Select(a => a.HierarchyType)
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
    /// 
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
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

        var areasWithRelations = new AreaWithRelationsModel { Area = area };

        var parentNodeId = area.Node.GetAncestor(1);
        var parent = await _dbContext.Area.Where(a => a.Node == parentNodeId).FirstOrDefaultAsync();

        if (parent != null)
        {
            areasWithRelations.ParentArea = parent;
        }
        
        if (includeChildren)
        {
            await AddChildAreas(areasWithRelations, childAreaType, area);
        }

        if (includeAncestors)
        {
            await AddAncestorAreas(areasWithRelations, areaCode);
        }

        return areasWithRelations;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    public async Task<AreaModel?> GetRootAreaAsync()
    {
        var rootArea = await _dbContext
            .Area.Where(a => a.Node == HierarchyId.GetRoot())
            .FirstOrDefaultAsync();

        return rootArea;
    }

    private async Task AddChildAreas(AreaWithRelationsModel aresWithRelations, string? childAreaType, AreaModel area)
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

    
    private async Task AddAncestorAreas(AreaWithRelationsModel aresWithRelations, string areaCode)
    {
        var ancestors = await _dbContext
                        .Area.FromSqlInterpolated(
                            $"""
                    --get all the parents recursively up the hierarchy
                    SELECT
                        parent.*
                    FROM
                        [Areas].[Areas] startingPoint
                    INNER JOIN
                        [Areas].[Areas] parent
                    ON
                        startingPoint.Node.IsDescendantOf(parent.Node) = 1
                    WHERE
                        startingPoint.AreaCode = {areaCode}
                    AND
                        parent.AreaCode != {areaCode}
                    ORDER BY
                        parent.[Level] desc
                    """
                        )
                        .ToListAsync();

        aresWithRelations.Ancestors = ancestors.ToArray();
    }
}
