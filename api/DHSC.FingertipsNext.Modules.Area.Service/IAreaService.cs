using DHSC.FingertipsNext.Modules.Area.Schemas;

namespace DHSC.FingertipsNext.Modules.Area.Service;

/// <summary>
///
/// </summary>
public interface IAreaService
{
    /// <summary>
    /// Get all available hierarchy types
    /// </summary>
    /// <returns></returns>
    public Task<IEnumerable<string>> GetHierarchies();

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public Task<IEnumerable<string>> GetAreaTypes(string? hierarchyType = null);

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including its
    /// children and ancestors.
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="childAreaType"></param>
    /// <returns>The requested area node, or null if it cannot be located.</returns>
    public Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeAncestors,
        string? childAreaType
    );

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns></returns>
    public Task<RootArea> GetRootArea();
}
