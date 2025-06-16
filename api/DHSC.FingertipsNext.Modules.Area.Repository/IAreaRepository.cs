using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

/// <summary>
///
/// </summary>
public interface IAreaRepository
{
    /// <summary>
    /// Gets all hierarchies from the database.
    /// </summary>
    /// <returns></returns>
    Task<IList<string>> GetHierarchiesAsync();

    /// <summary>
    /// Retrieves a list of area models based on the requested area codes.
    /// </summary>
    /// <param name="areaCodes"></param>
    /// <returns>List of areas requested</returns>
    Task<IList<AreaModel>> GetMultipleAreaDetailsAsync(string[] areaCodes);

    /// <summary>
    /// Gets all area types from the database matching given hierarchy type.
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    Task<IList<AreaTypeModel>> GetAreaTypesAsync(string hierarchyType);

    /// <summary>
    /// Gets all area types from the database.
    /// </summary>
    /// <returns></returns>
    Task<IList<AreaTypeModel>> GetAllAreaTypesAsync();

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
    /// <returns>The requested area or null if one can't be found.</returns>
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
    Task<IList<AreaModel>> GetAreasForAreaTypeAsync(string areaTypeKey);
}
