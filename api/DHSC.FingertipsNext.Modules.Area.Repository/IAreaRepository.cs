using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

/// <summary>
/// 
/// </summary>
public interface IAreaRepository
{
    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task<string[]> GetHierarchiesAsync();

    /// <summary>
    /// 
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    Task<string[]> GetAreaTypesAsync(string? hierarchyType);

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including
    /// its children and ancestors.
    /// </summary>
    /// <param name="areaCode">The area code of the area/geography</param>
    /// <param name="includeChildren">Optionally, include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="includeAncestors">Optionally, include the ancestor areas.</param>
    /// <param name="childAreaType">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns>The requested area, or null if it cannot be located.</returns>
    Task<AreaWithRelationsModel?> GetAreaAsync(string areaCode, bool includeChildren, bool includeAncestors, string? childAreaType);

    /// <summary>
    /// 
    /// </summary>
    /// <returns></returns>
    Task<AreaModel?> GetRootAreaAsync();
}