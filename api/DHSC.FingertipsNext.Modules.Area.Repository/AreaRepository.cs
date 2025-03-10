using System.Linq.Expressions;
using System.Xml.XPath;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Microsoft.IdentityModel.Tokens;
using System.Net.Http.Headers;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

/// <summary>
///
/// </summary>
public static class Extensions
{
    public static IQueryable<AreaModel> ProcessIncludes(
        this IIncludableQueryable<AreaModel,AreaTypeModel> queryable,
        int maxLevel)
    {
        var query = queryable

            .Include(a => a.Children)
            .ThenInclude(a => a.Children)

            .Include(a => a.Children)
            .ThenInclude(x => x.Parents)

            .Include(a => a.Children)
            .ThenInclude(x => x.AreaType)




            .Include(a => a.Parents)
            .ThenInclude(x => x.Parents)

            .Include(a => a.Parents)
            .ThenInclude(x => x.Children)

            .Include(a => a.Parents)
            .ThenInclude(x => x.AreaType);

        return query;
    }
}

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
    /// <param name="includeSiblings"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelationsModel?> GetAreaAsync(
        string areaCode,
        bool includeChildren,
        bool includeSiblings,
        string? childAreaType
    )
    {

       var area = await _dbContext
            .Area
            .Include(a => a.AreaType)
            .ProcessIncludes(3)
            .Where(a => a.AreaCode == areaCode)
            .AsSplitQuery()
            .FirstOrDefaultAsync();

        var areasWithRelations = new AreaWithRelationsModel { Area = area};
        areasWithRelations.ParentAreas = area.Parents.ToList();

        areasWithRelations.Siblings = includeSiblings ? area.Parents.SelectMany(p => p.Children).ToList() : null;

        // Get the principle requested area.
   /*     var area = await _dbContext
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
            areasWithRelations.ParentAreas = parents;
        }
*/
        if (includeChildren)
        {
            var descendents = await GetDescendantAreas(area, childAreaType);
            areasWithRelations.Children = area.Children.Concat(descendents).ToList();
        }
        return areasWithRelations;
    }

    // This uses recursive cte term to find all the descendants in the hierarchy - yes it is complex
    // and this represents a maintenance issue. But there is inherent complexity in what is being
    // implemented here.
    //
    // This function needs to traverse a graph (not just a tree) until it has found all descendants of
    // the parent of the specific type. It should also make sure what is returned is unique.
    private async Task<ICollection<AreaModel>> GetDescendantAreas(AreaModel startingArea, string childAreaTypeKey)
    {
        var areaWithAreaTypeList = await _dbContext
            .DenormalisedAreaWithAreaType
            .FromSql(
                $"""
                    WITH recursive_cte(
                AreaKey,
                AreaCode,
                AreaName,
                AreaTypeKey,
                AreaLevel,
                ParentAreaKey) AS (
                SELECT
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
                INNER JOIN
                    recursive_cte ON recursive_cte.AreaKey = ar.ParentAreaKey

                )
                SELECT DISTINCT
                    AreaKey,
                    AreaCode,
                    AreaName,
                    rc.AreaTypeKey as AreaTypeKey,
                    at.Level as Level,
                    at.HierarchyType as HierarchyType,
                    at.AreaTypeName as AreaTypeName
                FROM
                    recursive_cte rc
                JOIN
                    Areas.AreaTypes at
                ON
                    rc.AreaTypeKey = at.AreaTypeKey
                WHERE
                    rc.AreaTypeKey = {childAreaTypeKey}
                """
            )
            .ToListAsync();

        return [.. areaWithAreaTypeList
            .Select(a => a.Normalise())
            .OrderBy(a => a.AreaType.Level)];
    }
}
