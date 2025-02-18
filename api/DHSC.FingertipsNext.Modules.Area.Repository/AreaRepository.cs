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
    public async Task<List<string>> GetHierarchiesAsync()
    {
        var hierarchies = await _dbContext
            .AreaType.Select(a => a.HierarchyType)
            .Where(a => a != InternalHierarchyTypes.All)
            .Distinct()
            .ToListAsync();

        return hierarchies;
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public async Task<List<AreaTypeModel>> GetAreaTypesAsync(string? hierarchyType)
    {
        IQueryable<AreaTypeModel> areaTypes;
        if (!string.IsNullOrEmpty(hierarchyType))
            areaTypes = _dbContext.AreaType.Where(a =>
                a.HierarchyType == hierarchyType || a.HierarchyType == InternalHierarchyTypes.All
            );
        else
            areaTypes = _dbContext.AreaType;

        return await areaTypes.ToListAsync();
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaType"></param>
    /// <returns></returns>
    public async Task<List<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey)
    {
        return await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(a => a.AreaTypeKey == areaTypeKey)
            .ToListAsync();
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="includeSiblings"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelationsModel?> GetAreaAsync(
        string areaCode,
        bool includeChildren,
        bool includeAncestors,
        bool includeSiblings,
        string? childAreaType
    )
    {
        var area = await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(area => area.AreaCode == areaCode)
            .FirstOrDefaultAsync();

        if (area == null)
            return null;

        var areasWithRelations = new AreaWithRelationsModel { Area = area };

        var parentNodeId = area.Node.GetAncestor(1);
        var parent = await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(a => a.Node == parentNodeId)
            .FirstOrDefaultAsync();

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

        if (includeSiblings && parent != null)
        {
            await AddSiblingAreas(areasWithRelations, area, parent);
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
            .Area.Include(a => a.AreaType)
            .Where(a => a.Node == HierarchyId.GetRoot())
            .FirstOrDefaultAsync();

        return rootArea;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaWithRelations"></param>
    /// <param name="childAreaType"></param>
    /// <param name="area"></param>
    private async Task AddChildAreas(
        AreaWithRelationsModel areaWithRelations,
        string? childAreaType,
        AreaModel area
    )
    {
        if (string.IsNullOrWhiteSpace(childAreaType))
        {
            // direct children
            areaWithRelations.Children = await _dbContext
                .Area.Include(a => a.AreaType)
                .Where(a => a.Node.GetAncestor(1) == area.Node)
                .ToListAsync();
        }
        else
        {
            // children lower down the hierarchy
            var singleChildOfType = await _dbContext
                .Area.Include(a => a.AreaType)
                .Where(a => a.AreaTypeKey == childAreaType)
                .FirstOrDefaultAsync();

            if (singleChildOfType != null)
            {
                int parentLevel = area.Node.GetLevel();

                areaWithRelations.Children = await _dbContext
                    .Area.Include(a => a.AreaType)
                    .Where(a =>
                        a.Node.GetAncestor(singleChildOfType.Node.GetLevel() - parentLevel)
                        == area.Node
                    )
                    .ToListAsync();
            }
        }
    }

    private async Task AddAncestorAreas(AreaWithRelationsModel areaWithRelations, string areaCode)
    {
        areaWithRelations.Ancestors = await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                --get all the parents recursively up the hierarchy
                SELECT
                    parent.[Node], parent.[AreaCode], parent.[AreaName], [parent].[AreaTypeKey]
                FROM
                    [Areas].[Areas] as startingPoint
                
                INNER JOIN
                    [Areas].[Areas] parent
                    ON
                    startingPoint.Node.IsDescendantOf([parent].[Node]) = 1
               
                WHERE
                    startingPoint.[AreaCode] = {areaCode}
                    AND
                    parent.[AreaCode] != {areaCode}
                """
            )
            .Include(a => a.AreaType)
            .OrderBy(a => a.AreaType.Level)
            .ToListAsync();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaWithRelations"></param>
    /// <param name="area"></param>
    /// <param name="parent"></param>
    private async Task AddSiblingAreas(
        AreaWithRelationsModel areaWithRelations,
        AreaModel area,
        AreaModel parent
    )
    {
        areaWithRelations.Siblings = await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(a => a.Node.GetAncestor(1) == parent.Node && a.AreaCode != area.AreaCode)
            .ToListAsync();
    }
}
