using System.Diagnostics.CodeAnalysis;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace DHSC.FingertipsNext.Modules.Area.Controllers.V1;

/// <summary>
///
/// </summary>
[ApiController]
[Route("areas")]
public class AreaController : ControllerBase
{
    private readonly IAreaService _areaService;
    private const int MaxNumberAreas = 100;

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaService"></param>
    public AreaController(IAreaService areaService) => _areaService = areaService;

    /// <summary>
    /// Gets the details of each area requested by the client.
    /// </summary>
    /// <param name="areaCodes">A list of area codes provided in the query params</param>
    /// <returns>The corresponding area data for the list of area codes provided</returns>
    /// <remarks>
    /// If no area codes are provided then a client error response is returned.
    /// </remarks>
    [HttpGet]
    [ProducesResponseType(typeof(List<Schemas.Area>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetMultipleAreaDetailsAsync(
        [FromQuery(Name = "area_codes")] string[]? areaCodes = null
    )
    {
        if (areaCodes == null || areaCodes.Length == 0)
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "Please provide at least one value for the parameter area_codes"
            });

        if (areaCodes is {Length: > MaxNumberAreas})
            return new BadRequestObjectResult(new SimpleError
            {
                Message =
                    $"Too many values supplied for parameter area_codes. The maximum is {MaxNumberAreas} but {areaCodes.Length} supplied."
            });

        var areasData = await _areaService.GetMultipleAreaDetails(areaCodes);

        if (areasData.IsNullOrEmpty()) return NotFound();

        return Ok(areasData);
    }

    /// <summary>
    /// Get all available hierarchy types
    /// </summary>
    /// <returns>The available hierarchy types, e.g. NHS or Administrative</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<string>), StatusCodes.Status200OK)]
    [Route("hierarchies")]
    public async Task<IActionResult> GetHierarchiesAsync() =>
        Ok(await _areaService.GetHierarchies());

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchy_type"></param>
    /// <returns>The available area types e.g. ICB, PCN or GP Surgery</returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<AreaType>), StatusCodes.Status200OK)]
    [Route("areatypes")]
    public async Task<IActionResult> GetAreatypesAsync([FromQuery] string? hierarchy_type = null) =>
        Ok(await _areaService.GetAreaTypes(hierarchy_type));

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including its children.
    /// </summary>
    /// <param name="area_code">The area code of the area/geography</param>
    /// <param name="include_children">Optional. Include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="include_siblings">Optional. Include the sibling areas.</param>
    /// <param name="child_area_type">Optional. Functions only when include_children is true. The type of area to
    /// request children for. If no child area type is supplied, or is empty/white space then the direct child areas
    /// will be retrieved.</param>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(AreaWithRelations), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Route("{area_code}")]
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public async Task<IActionResult> GetAreaDetailsAsync(
        [FromRoute] string area_code,
        [FromQuery] bool? include_children = null,
        [FromQuery] bool? include_siblings = null,
        [FromQuery] string? child_area_type = null
    )
    {
        var areaDetails = await _areaService.GetAreaDetails(
            area_code,
            include_children,
            include_siblings,
            child_area_type
        );

        return areaDetails == null ? NotFound() : Ok(areaDetails);
    }

    /// <summary>
    /// Get the areas that have a given area type
    /// </summary>
    /// <param name="area_type_key"></param>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(List<Schemas.Area>), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Route("areatypes/{area_type_key}/areas")]
    [SuppressMessage("ReSharper", "InconsistentNaming")]
    public async Task<IActionResult> GetAreaDetailsForAreaTypeAsync([FromRoute] string area_type_key)
    {
        var areaDetails = await _areaService.GetAreaDetailsForAreaType(area_type_key);

        return areaDetails.Count == 0 ? NotFound() : Ok(areaDetails);
    }

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns>The root area node</returns>
    [HttpGet]
    [ProducesResponseType(typeof(RootArea), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Route("root")]
    public IActionResult GetRootAreaAsync() => Ok(_areaService.GetRootArea());
}
