using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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
        // Get the principle requested area.
        var area = await _dbContext
            .Area.Include(a => a.AreaType)
            .Where(area => area.AreaCode == areaCode)
            .FirstOrDefaultAsync();

        if (area == null)
            return null;

        var areasWithRelations = new AreaWithRelationsModel { Area = area };

        // Get the immediate parents 
        var parents = await GetParentAreas(area.AreaKey);
        
        if (!parents.IsNullOrEmpty())
        {
            // Todo - should return all parents
            areasWithRelations.ParentArea = parents[0];
        }

        if (includeChildren)
        {
            await AddChildAreas(areasWithRelations, childAreaType, area);
        }

        if (includeAncestors)
        {
            // Todo - should return all parents
            await AddAncestorAreas(areasWithRelations, areaCode);
        }

        if (includeSiblings && !parents.IsNullOrEmpty())
        {
            await AddSiblingAreas(areasWithRelations, area, parents[0]);
        }

        return areasWithRelations;
    }

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    /// 
    // TODO remove use of Node
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
            areaWithRelations.Children = await GetChildAreas(area.AreaKey);
        }
        else
        {
            areaWithRelations.Children = await GetDescendantAreas(area, childAreaType);
            // children lower down the hierarchy
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


    private async Task<List<AreaModel>> GetParentAreas(int childAreaKey)
    {
        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                --- Find the parent IDs and then return ParentAreas
                WITH parentAreaKeys AS 
                (  
                  SELECT ParentAreaKey 
                  FROM Areas.AreaRelationships
                  WHERE ChildAreaKey = {childAreaKey} 
                )
                SELECT * FROM Areas.Areas
                WHERE AreaKey in 
                ( 
                  SELECT ParentAreaKey 
                  FROM parentAreaKeys 
                ) 
                """
            )
            .ToListAsync();
    }

    private async Task<List<AreaModel>> GetChildAreas(int parentAreaKey)
    {
        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                --- Find the child IDs and then return ChildAreas
                WITH childAreaKeys AS 
                (
                  SELECT ChildAreaKey 
                  FROM Areas.AreaRelationships 
                  WHERE ParentAreaKey = {parentAreaKey} 
                )
                SELECT * FROM Areas.Areas
                WHERE AreaKey in 
                (
                  SELECT ChildAreaKey 
                  FROM childAreaKeys 
                )
                """
            )
            .ToListAsync();
    }

    // This uses recursive cte term to find all the descendants in the hierarchy - yes it is complex 
    // and this represents a maintenance issue. But there is inherent complexity in what is being
    // implemented here.
    //
    // This function needs to traverse a graph (not just a tree) until it has found all descendants of 
    // the parent of the specific type, being careful not to traverse the graph further than is
    // necessary. It should also make sure what is returned is unique.

    // TODO Make results unique
    private async Task<List<AreaModel>> GetDescendantAreas(AreaModel area, string childAreaTypeKey)
    {
        var childAreaType = await _dbContext
        .AreaType.Where(a => a.AreaTypeKey == childAreaTypeKey)
        .FirstAsync();

        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                WITH recursive_cte(
                Node,
                AreaKey,
                AreaCode,
                AreaName,
                AreaTypeKey,
                AreaLevel,
                ParentAreaKey) AS (
                SELECT
                    a.Node,
                   	ar.ChildAreaKey as AreaKey,
                    a.AreaCode,
                    a.AreaName,
                   	a.AreaTypeKey,
                   	at2.[Level] as AreaLevel,
                   	ar.ParentAreaKey
                FROM
                   	Areas.AreaRelationships ar
                JOIN
                    Areas.Areas a ON a.AreaKey = ar.ChildAreaKey
                JOIN
                   	Areas.AreaTypes at2 ON at2.AreaTypeKey = a.AreaTypeKey
                WHERE
                   	ar.ParentAreaKey = {area.AreaKey}
                UNION ALL
                SELECT
                    a.Node,
                   	ar.ChildAreaKey as AreaKey,
                    a.AreaCode,
                    a.AreaName,
                   	a.AreaTypeKey,
                   	at2.[Level] as AreaLevel,
                   	ar.ParentAreaKey
                FROM
                   	Areas.AreaRelationships ar
                JOIN
                    Areas.Areas a ON a.AreaKey = ar.ChildAreaKey
                JOIN
                   	Areas.AreaTypes at2 ON at2.AreaTypeKey = a.AreaTypeKey
                INNER JOIN recursive_cte ON recursive_cte.AreaKey = ar.ParentAreaKey
                WHERE
                    at2.[Level] <= {childAreaType.Level}
                )
                SELECT
                   	Node,
                    AreaKey,
                    AreaCode,
                    AreaName,
                    AreaTypeKey
                FROM
                   	recursive_cte
                WHERE
                    AreaTypeKey = {childAreaType.AreaTypeKey}
                """
            )
            .ToListAsync();
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaWithRelations"></param>
    /// <param name="area"></param>
    /// <param name="parent"></param>
    /// 
    //TODO make this handle multiple parents
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
