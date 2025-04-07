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
    public Task<List<string>> GetHierarchies();

    /// <summary>
    /// Gets a list of areas for the list of requested area codes.
    /// </summary>
    /// <param name="areaCodes"></param>
    /// <returns>List of areas requested</returns>
    public Task<List<Schemas.Area>> GetMultipleAreaDetails(string[] areaCodes);

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchyType"></param>
    /// <returns></returns>
    public Task<List<AreaType>> GetAreaTypes(string? hierarchyType = null);

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including its children.
    /// </summary>
    /// <param name="areaCode">The area code of the area/geography</param>
    /// <param name="includeChildren">Optionally, include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="includeSiblings">Optionally, include the sibling areas.</param>
    /// <param name="childAreaType">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns>The requested area node, or null if it cannot be located.</returns>
    public Task<AreaWithRelations?> GetAreaDetails(
        string areaCode,
        bool? includeChildren,
        bool? includeSiblings,
        string? childAreaType
    );

    /// <summary>
    /// Get the areas that have a given area type
    /// </summary>
    /// <param name="areaTypeKey"></param>
    /// <returns></returns>
    public Task<List<Schemas.Area>> GetAreaDetailsForAreaType(string areaTypeKey);

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns></returns>
    public RootArea? GetRootArea();
}
