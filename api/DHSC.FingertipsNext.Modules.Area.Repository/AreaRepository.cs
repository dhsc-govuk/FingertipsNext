using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepository : IAreaRepository
{
    private readonly AreaRepositoryDbContext _dbContext;

    /// <summary>
    ///
    /// </summary>
    /// <param name="dbContext"></param>
    /// <exception cref="ArgumentNullException"></exception>
    public AreaRepository(AreaRepositoryDbContext dbContext) =>
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

    /// <summary>
    ///
    /// </summary>
    /// <returns></returns>
    public async Task<IList<string>> GetHierarchiesAsync() =>
        await _dbContext.AreaType
            .Select(areaType => areaType.HierarchyType)
            .Where(areaType => areaType != InternalHierarchyTypes.Both)
            .Distinct()
            .ToListAsync().ConfigureAwait(false);

    /// <summary>
    /// Retrieves a list of area models based on the requested area codes.
    /// </summary>
    /// <param name="areaCodes"></param>
    /// <returns>List of areas requested</returns>
    public async Task<IList<AreaModel>> GetMultipleAreaDetailsAsync(string[] areaCodes)
    {
        return await _dbContext.Area
            .Where(area => EF.Constant(areaCodes).Contains(area.AreaCode))
            .Include(area => area.AreaType)
            .Select(area => new AreaModel
            {
                AreaCode = area.AreaCode,
                AreaName = area.AreaName,
                AreaType = new AreaTypeModel
                {
                    AreaTypeKey = area.AreaType.AreaTypeKey,
                    AreaTypeName = area.AreaType.AreaTypeName,
                    HierarchyType = area.AreaType.HierarchyType,
                    Level = area.AreaType.Level
                }
            })
            .AsNoTracking()
            .ToListAsync().ConfigureAwait(false);
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public async Task<IList<AreaTypeModel>> GetAreaTypesAsync(string hierarchyType)
    {
        IQueryable<AreaTypeModel> areaTypes;
        if (!string.IsNullOrEmpty(hierarchyType))
            areaTypes = _dbContext.AreaType
                .Where(areaType => areaType.HierarchyType == hierarchyType || areaType.HierarchyType == InternalHierarchyTypes.Both);
        else
            areaTypes = _dbContext.AreaType;

        return await areaTypes.ToListAsync().ConfigureAwait(false);
    }

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaTypeKey"></param>
    /// <returns></returns>
    public async Task<IList<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey) =>
        await _dbContext.Area
        .Include(area => area.AreaType)
        .Where(area => area.AreaTypeKey == areaTypeKey)
        .ToListAsync().ConfigureAwait(false);

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeSiblings"></param>
    /// <param name="childAreaType"></param>
    /// <returns></returns>
    public async Task<AreaWithRelationsModel> GetAreaAsync
    (
        string areaCode,
        bool includeChildren,
        bool includeSiblings,
        string childAreaType
    )
    {

        var area = await _dbContext
             .Area
             .Include(area => area.AreaType)
             .Include(a => a.Children)
                 .ThenInclude(area => area.Children)

                 .Include(area => area.Children)
                 .ThenInclude(area => area.Parents)

                 .Include(area => area.Children)
                 .ThenInclude(area => area.AreaType)

             .Include(area => area.Parents)
                 .ThenInclude(area => area.Parents)

                 .Include(area => area.Parents)
                 .ThenInclude(area => area.Children)

                 .Include(area => area.Parents)
                 .ThenInclude(area => area.AreaType)
             .Where(area => area.AreaCode == areaCode)
             .AsSplitQuery()
             .FirstOrDefaultAsync().ConfigureAwait(false);

        if (area == null)
        {
            return null;
        }

        var areasWithRelations = new AreaWithRelationsModel
        {
            Area = area,
            ParentAreas = area.Parents.ToList(),
            Siblings = includeSiblings ? area.Parents.SelectMany(p => p.Children).ToList() : [],
            Children = includeChildren ? await GetChildren(childAreaType, area) : null
        };

        return areasWithRelations;
    }

    private async Task<IList<AreaModel>> GetChildren(string childAreaType, AreaModel area)
    {
        return string.IsNullOrWhiteSpace(childAreaType) ?
            area.Children.ToList() :
            (await GetDescendantAreas(area, childAreaType).ConfigureAwait(false)).ToList();
    }

    // Retrieves all descendant areas of a specified area, filtered by a requested area type.
    // in a sorted ordered by hierarchy level.
    private async Task<ICollection<AreaModel>> GetDescendantAreas(AreaModel startingArea, string childAreaTypeKey)
    {
        var areaWithAreaTypeList = await _dbContext.DenormalisedAreaWithAreaType
        .FromSqlRaw(
            "SELECT * FROM dbo.FindAreaDescendants_Fn(@RequestedAreaType, @RequestedAncestorAreaCode)",
            new SqlParameter("@RequestedAreaType", childAreaTypeKey),
            new SqlParameter("@RequestedAncestorAreaCode", startingArea.AreaCode)
        )
        .ToListAsync().ConfigureAwait(false);
        return [.. areaWithAreaTypeList
            .Select(area => area.Normalise())
            .OrderBy(area => area.AreaType.Level)];
    }
}
