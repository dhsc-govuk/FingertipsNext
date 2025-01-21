using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public interface IAreaRepository
{
    Task<string[]> GetHierarchiesAsync();

    Task<string[]> GetAreaTypesAsync(string? hierarchyType);

    Task<AreaWithRelationsModel?> GetAreaAsync(string areaCode, bool includeChildren, bool includeAncestors, string? childAreaType);

    Task<AreaModel?> GetRootAreaAsync();
}