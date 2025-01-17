using DHSC.FingertipsNext.Modules.Area.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Area.Controllers.V1;

/// <summary>
///
/// </summary>
[ApiController]
[Route("areas")]
public class AreaController : ControllerBase
{
    private readonly IAreaService _areaService;

    /// <summary>
    ///
    /// </summary>
    /// <param name="areaService"></param>
    public AreaController(IAreaService areaService)
    {
        _areaService = areaService;
    }

    /// <summary>
    /// Get all available hierarchy types
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("hierarchies")]
    public async Task<IActionResult> GetHierarchiesAsync()
    {
        // 200 string[]
        // The available hierarchy types, e.g. NHS or Administrative

        // return !indicatorData.Any() ? NotFound() : Ok(indicatorData);
        return NotFound();
    }

    /// <summary>
    /// Get area types, optionally filtering by hierarchy type
    /// </summary>
    /// <param name="hierarchy_type"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("areatypes")]
    public async Task<IActionResult> GetAreatypesAsync([FromQuery] string? hierarchy_type = null)
    {
        // 200 string[]
        // The available area types e.g. ICB, PCN or GP Surgery

        // return !indicatorData.Any() ? NotFound() : Ok(indicatorData);
        return NotFound();
    }

    /// <summary>
    /// Get the full details of a given area, including its parent, optionally including
    /// its children and ancestors.
    /// </summary>
    /// <param name="area_code">The area code of the area/geography</param>
    /// <param name="include_children">Optionally, include the child areas. By default, this is the direct children,
    /// to get children at a lower level supply the optional query parameter for child area type.</param>
    /// <param name="include_ancestors">Optionally, include the ancestor areas.</param>
    /// <param name="child_area_type">The type of area to request children for.</param>
    /// <returns></returns>
    [HttpGet]
    [Route("{areaCode}")]
    public async Task<IActionResult> GetAreaDetailsAsync(
        [FromRoute] string area_code,
        [FromQuery] bool? include_children = null,
        [FromQuery] bool? include_ancestors = null,
        [FromQuery] string? child_area_type = null
    )
    {
        // 200 AreaWithRelations
        // The area node

        var areaDetails = await _areaService.GetAreaDetails(
            area_code,
            include_children,
            include_ancestors,
            child_area_type
        );

        return areaDetails == null ? NotFound() : Ok(areaDetails);
    }

    /// <summary>
    /// Get the root node of the area hierarchy
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [Route("root")]
    public async Task<IActionResult> GetRootAreaAsync()
    {
        // 200 RootArea
        // The root area node

        // return !indicatorData.Any() ? NotFound() : Ok(indicatorData);
        return NotFound();
    }
}
