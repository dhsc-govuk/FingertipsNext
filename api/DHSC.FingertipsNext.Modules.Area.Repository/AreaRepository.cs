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
                a.HierarchyType == hierarchyType || a.HierarchyType == SpecialHierarchyTypes.All
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
    /// <param name="aresWithRelations"></param>
    /// <param name="childAreaType"></param>
    /// <param name="area"></param>
    private async Task AddChildAreas(
        AreaWithRelationsModel aresWithRelations,
        string? childAreaType,
        AreaModel area
    )
    {
        if (string.IsNullOrWhiteSpace(childAreaType))
        {
            // direct children
            aresWithRelations.Children = await _dbContext
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

                aresWithRelations.Children = await _dbContext
                    .Area.Include(a => a.AreaType)
                    .Where(a =>
                        a.Node.GetAncestor(singleChildOfType.Node.GetLevel() - parentLevel)
                        == area.Node
                    )
                    .ToListAsync();
            }
        }
    }

    private async Task AddAncestorAreas(AreaWithRelationsModel aresWithRelations, string areaCode)
    {
        // SELECT TOP(1)
        // [a].[Node], [a].[AreaCode], [a].[AreaName], [a].[AreaTypeKey],
        // [a0].[AreaTypeKey], [a0].[AreaTypeName], [a0].[HierarchyType], [a0].[Level]
        // FROM [Areas].[Areas] AS [a]
        // INNER JOIN [Areas].[AreaTypes] AS [a0] ON [a].[AreaTypeKey] = [a0].[AreaTypeKey]
        // WHERE [a].[AreaCode] = @__areaCode_0

        aresWithRelations.Ancestors = await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                --get all the parents recursively up the hierarchy
                SELECT
                    startingPoint.[Node], startingPoint.[AreaCode], startingPoint.[AreaName], startingPoint.[AreaTypeKey],
                    areaType.[AreaTypeName], areaType.[HierarchyType], areaType.[Level]
                FROM
                    [Areas].[Areas] as startingPoint
                    INNER JOIN
                        [Areas].[Areas] parent
                    ON
                        startingPoint.Node.IsDescendantOf(parent.Node) = 1
                INNER JOIN
                    [Areas].[AreaTypes] AS areaType
                ON
                    parent.[AreaTypeKey] = areaType.[AreaTypeKey]
                WHERE
                    startingPoint.AreaCode = {areaCode}
                  AND
                    parent.AreaCode != {areaCode}
                AND
                    parent.AreaTypeKey = areaType.AreaTypeKey
                ORDER BY
                    areaType.Level desc
                """
            )
            .ToListAsync();
    }

    private async Task AddSiblingAreas(
        AreaWithRelationsModel aresWithRelations,
        AreaModel area,
        AreaModel parent
    )
    {
        aresWithRelations.Siblings = await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(a => a.Node.GetAncestor(1) == parent.Node && a.AreaCode != area.AreaCode)
            .ToListAsync();
    }
}
