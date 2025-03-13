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
    Task<List<string>> GetHierarchiesAsync();

    /// <summary>
    ///
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    Task<List<AreaTypeModel>> GetAreaTypesAsync(string? hierarchyType);

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including its children.
    /// </summary>
    /// <param name="areaCode">The area code of the area/geography</param>
    /// <param name="includeChildren">Optional. Include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="includeSiblings">Optional. Include the sibling areas.</param>
    /// <param name="childAreaType">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns>The requested area, or null if it cannot be located.</returns>
    Task<AreaWithRelationsModel?> GetAreaAsync(
        string areaCode,
        bool includeChildren,
        bool includeSiblings,
        string? childAreaType
    );

    /// <summary>
    /// Get the areas that have a given area type
    /// </summary>
    /// <param name="areaTypeKey"></param>
    /// <returns></returns>
    Task<List<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey);
}
