using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public class AreaRepository : IAreaRepository
{
    private readonly AreaRepositoryDbContext _dbContext;

    public AreaRepository(AreaRepositoryDbContext dbContext) =>
        _dbContext = dbContext ?? throw new ArgumentNullException(nameof(dbContext));

    public async Task<IList<string>> GetHierarchiesAsync() =>
        await _dbContext.AreaType
            .Select(areaType => areaType.HierarchyType)
            .Where(areaType => areaType != InternalHierarchyTypes.Both)
            .Distinct()
            .ToListAsync();

    public async Task<IList<AreaModel>> GetMultipleAreaDetailsAsync(string[] areaCodes)
    {
        return await _dbContext.Area
            .Where(area => EF.Constant(areaCodes).Contains(area.AreaCode))
            .Include(area => area.AreaType)
            .Select(area => new AreaModel
            {
                AreaCode = area.AreaCode,
                AreaName = area.AreaName,
                AreaTypeKey = area.AreaTypeKey,
                AreaType = new AreaTypeModel
                {
                    AreaTypeKey = area.AreaType.AreaTypeKey,
                    AreaTypeName = area.AreaType.AreaTypeName,
                    HierarchyType = area.AreaType.HierarchyType,
                    Level = area.AreaType.Level
                }
            })
            .AsNoTracking()
            .ToListAsync();
    }

    public async Task<IList<AreaTypeModel>> GetAreaTypesAsync(string hierarchyType)
    {
        return await _dbContext.AreaType
            .Where(areaType => areaType.HierarchyType == hierarchyType || areaType.HierarchyType == InternalHierarchyTypes.Both).ToListAsync();
    }

    public async Task<IList<AreaTypeModel>> GetAllAreaTypesAsync()
    {
        return await _dbContext.AreaType.ToListAsync();
    }

    public async Task<IList<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey) =>
        await _dbContext.Area
        .Include(area => area.AreaType)
        .Where(area => area.AreaTypeKey == areaTypeKey)
        .ToListAsync();

    public async Task<AreaWithRelationsModel?> GetAreaAsync
    (
        string areaCode,
        bool includeChildren,
        bool includeSiblings,
        string? childAreaType
    )
    {
        AreaModel? area = await _dbContext
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
             .FirstOrDefaultAsync();

        if (area == null)
        {
            return null;
        }

        return new AreaWithRelationsModel
        {
            Area = area,
            ParentAreas = area.Parents.ToList(),
            Siblings = includeSiblings ? area.Parents.SelectMany(p => p.Children).ToList() : [],
            Children = includeChildren ? await GetChildren(childAreaType, area) : []
        };
    }

    private async Task<IList<AreaModel>> GetChildren(string? childAreaType, AreaModel area)
    {
        return childAreaType == null ?
            area.Children.ToList() :
            (await GetDescendantAreas(area, childAreaType)).ToList();
    }

    /// <summary>
    /// Retrieves all descendant areas of a specified area, filtered by a requested area type.
    /// in a sorted ordered by hierarchy level.
    /// </summary>
    /// <param name="startingArea"></param>
    /// <param name="childAreaTypeKey"></param>
    /// <returns></returns>
    private async Task<ICollection<AreaModel>> GetDescendantAreas(AreaModel startingArea, string childAreaTypeKey)
    {
        var areaWithAreaTypeList = await _dbContext.DenormalisedAreaWithAreaType
        .FromSqlRaw(
            "SELECT * FROM dbo.FindAreaDescendants_Fn(@RequestedAreaType, @RequestedAncestorAreaCode)",
            new SqlParameter("@RequestedAreaType", childAreaTypeKey),
            new SqlParameter("@RequestedAncestorAreaCode", startingArea.AreaCode)
        )
        .ToListAsync();
        return [.. areaWithAreaTypeList
            .Select(area => area.Normalise())
            .OrderBy(area => area.AreaType.Level)];
    }
}
