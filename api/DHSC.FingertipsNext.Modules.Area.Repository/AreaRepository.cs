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
            areaTypes = _dbContext.AreaType.Where(a => a.HierarchyType == hierarchyType);
        else
            areaTypes = _dbContext.AreaType;

        var list = await areaTypes.ToListAsync();
        list.Add(new AreaTypeModel { AreaTypeKey = "england", Level = 1, HierarchyType = "All", AreaTypeName = "England" });
        return list;
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaType"></param>
    /// <returns></returns>
    public async Task<List<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey)
    {
        return await _dbContext.Area.Where(a => a.AreaTypeKey == areaTypeKey).ToListAsync();
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
            .Area.Where(a => a.Node == HierarchyId.GetRoot())
            .FirstOrDefaultAsync();

        return rootArea;
    }

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
                .Area.Where(a => a.Node.GetAncestor(1) == area.Node)
                .ToListAsync();
        }
        else
        {
            // children lower down the hierarchy
            var singleChildOfType = await _dbContext
                .Area.Where(a => a.AreaTypeKey == childAreaType)
                .FirstOrDefaultAsync();

            if (singleChildOfType != null)
            {
                int parentLevel = area.AreaType.Level;

                aresWithRelations.Children = await _dbContext
                    .Area.Where(a =>
                        a.Node.GetAncestor(singleChildOfType.AreaType.Level - parentLevel) == area.Node
                    )
                    .ToListAsync();
            }
        }
    }

    private async Task AddAncestorAreas(AreaWithRelationsModel aresWithRelations, string areaCode)
    {
        aresWithRelations.Ancestors = await _dbContext
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
    }

    private async Task AddSiblingAreas(
        AreaWithRelationsModel aresWithRelations,
        AreaModel area,
        AreaModel parent
    )
    {
        aresWithRelations.Siblings = await _dbContext
            .Area.Where(a => a.Node.GetAncestor(1) == parent.Node && a.AreaCode != area.AreaCode)
            .ToListAsync();
    }
}
