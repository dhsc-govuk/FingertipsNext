using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Collections;
using System.Reflection.Metadata.Ecma335;

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
            areasWithRelations.ParentAreas = parents;
        }

        if (includeChildren)
        {
            areasWithRelations.Children = await GetChildAreas(childAreaType, area);
        }

        if (includeAncestors)
        {
            areasWithRelations.Ancestors = await GetAncestorAreas(area);
        }

        if (includeSiblings && !parents.IsNullOrEmpty())
        {
            areasWithRelations.Siblings = await GetSiblingAreas(area);
        }

        return areasWithRelations;
    }

    /// <summary>
    /// 
    /// </summary>
    /// <param name="childAreaType"></param>
    /// <param name="area"></param>
    private async Task<List<AreaModel>> GetChildAreas(
        string? childAreaType,
        AreaModel area
    )
    {
        if (string.IsNullOrWhiteSpace(childAreaType))
        {
            // direct children
            return await GetChildAreas(area.AreaKey);
        }
        else
        {
            // children lower down the hierarchy
            return await GetDescendantAreas(area, childAreaType);
        }
    }

    private async Task<List<AreaModel>> GetParentAreas(int childAreaKey)
    {
        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                SELECT 
                  * 
                FROM
                  Areas.Areas a                
                JOIN
                  Areas.AreaRelationships ar
                ON
                  ar.ParentAreaKey = a.AreaKey
                WHERE
                  ar.ChildAreaKey = {childAreaKey}
                """
            )
            .Include(a=>a.AreaType)
            .OrderBy(a=>a.AreaName)
            .ToListAsync();
    }

    private async Task<List<AreaModel>> GetChildAreas(int parentAreaKey)
    {
        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                SELECT
                  *
                FROM
                  Areas.Areas a
                JOIN
                  Areas.AreaRelationships ar
                ON
                  ar.ChildAreaKey = a.AreaKey
                WHERE
                  ar.ParentAreaKey = {parentAreaKey}
                """
            )
            .Include(a => a.AreaType)
            .OrderBy(a => a.AreaName)
            .ToListAsync();
    }

    // This uses recursive cte term to find all the descendants in the hierarchy - yes it is complex 
    // and this represents a maintenance issue. But there is inherent complexity in what is being
    // implemented here.
    //
    // This function needs to traverse a graph (not just a tree) until it has found all descendants of 
    // the parent of the specific type, being careful not to traverse the graph further than is
    // necessary. It should also make sure what is returned is unique.
    private async Task<List<AreaModel>> GetDescendantAreas(AreaModel startingArea, string childAreaTypeKey)
    {
        var childAreaType = await _dbContext
        .AreaType.Where(a => a.AreaTypeKey == childAreaTypeKey)
        .FirstAsync();

        var areaList = await _dbContext
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
                   	ar.ParentAreaKey = {startingArea.AreaKey}
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
                SELECT DISTINCT
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

        foreach (var area in areaList)
        {
            area.AreaType = await _dbContext.AreaType.Where(areaType => areaType.AreaTypeKey == area.AreaTypeKey).FirstAsync();
        }

        return [.. areaList.OrderBy(a => a.AreaType.Level)];
    }


    private async Task<List<AreaModel>> GetAncestorAreas(AreaModel startingArea)
    {
        var areaList = await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                WITH recursive_cte(
                Node,
                AreaKey,
                AreaCode,
                AreaName,
                AreaTypeKey,
                ParentAreaKey) AS (
                SELECT
                    a.Node,
                   	ar.ChildAreaKey as AreaKey,
                    a.AreaCode,
                    a.AreaName,
                   	a.AreaTypeKey,
                   	ar.ParentAreaKey
                FROM
                   	Areas.AreaRelationships ar
                JOIN
                    Areas.Areas a ON a.AreaKey = ar.ParentAreaKey
                WHERE
                   	ar.ChildAreaKey = {startingArea.AreaKey}
                UNION ALL
                SELECT
                    a.Node,
                   	ar.ChildAreaKey as AreaKey,
                    a.AreaCode,
                    a.AreaName,
                   	a.AreaTypeKey,
                   	ar.ParentAreaKey
                FROM
                   	Areas.AreaRelationships ar
                JOIN
                    Areas.Areas a ON a.AreaKey = ar.ParentAreaKey
                INNER JOIN recursive_cte ON recursive_cte.ParentAreaKey = ar.ChildAreaKey
                   	)
                SELECT DISTINCT
                   	Node,
                    AreaKey,
                    AreaCode,
                    AreaName,
                    AreaTypeKey
                FROM
                   	recursive_cte          
                """
            )
            .ToListAsync();

        foreach(var area in areaList)
        {
            area.AreaType = await _dbContext.AreaType.Where(areaType => areaType.AreaTypeKey == area.AreaTypeKey).FirstAsync();
        }

        return [.. areaList.OrderBy(a => a.AreaType.Level)];
    }


    /// <summary>
    /// 
    /// </summary>
    /// <param name="areaWithRelations"></param>
    /// <param name="area"></param>
    /// 
    private async Task<List<AreaModel>> GetSiblingAreas(
        AreaModel childArea
    )
    {
        return await _dbContext
            .Area
            .FromSqlInterpolated(
                $"""
                --- Find all children of the Parents
                SELECT DISTINCT
                  * 
                FROM 
                  Areas.Areas a
                JOIN 
                  Areas.AreaRelationships ar
                ON 
                  a.AreaKey = ar.ChildAreaKey
                WHERE ar.ParentAreaKey IN 
                (
                  SELECT 
                    ParentAreaKey 
                  FROM
                    Areas.AreaRelationships
                  WHERE
                    ChildAreaKey = { childArea.AreaKey } 
                ) AND a.AreaKey != { childArea.AreaKey }
                """
            )
            .Include(a => a.AreaType)
            .OrderBy(a => a.AreaName)
            .ToListAsync();
    }
}
