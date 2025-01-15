using DHSC.FingertipsNext.Modules.Area.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Area.Controllers.V1;

/// <summary>
///
/// </summary>
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
    /// Get the full details of a given area, including its parent, optionally including its children, siblings,
    /// cousins and ancestors
    /// </summary>
    /// <param name="areaCode"></param>
    /// <param name="includeChildren"></param>
    /// <param name="includeAncestors"></param>
    /// <param name="child_area_type"></param>
    /// <returns></returns>
    [HttpGet]
    [Route("{areaCode}")]
    public async Task<IActionResult> GetAreaDetailsAsync(
        [FromRoute] string areaCode,
        [FromQuery] bool? includeChildren = null,
        [FromQuery] bool? includeAncestors = null,
        [FromQuery] string? child_area_type = null
    )
    {
        // 200 AreaWithRelations
        // The area node

        var areaDetails = await _areaService.GetAreaDetails(
            areaCode,
            includeChildren,
            includeAncestors,
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
