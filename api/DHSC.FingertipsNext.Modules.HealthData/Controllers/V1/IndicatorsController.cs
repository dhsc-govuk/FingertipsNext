using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService)
    : ControllerBase
{
    readonly IIndicatorsService _indicatorsService = indicatorsService;

    /// <summary>
    /// Get data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 10 distinct area codes can be requested.</param>
    /// <param name="years">A list of years. Up to 10 distinct years can be requested.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 10 years are supplied only data for the first 10 distinct years will be returned.
    /// If more than 10 area codes are supplied only data for the first 10 distinct area codes will be returned.
    /// </remarks>
    [HttpGet]
    [Route("{indicatorId:int}/data")]
    public async Task<IActionResult> GetIndicatorDataAsync(
        [FromRoute] int indicatorId,
        [FromQuery(Name="area_codes")] string[]? areaCodes = null,
        [FromQuery] int[]? years = null,
        [FromQuery] string[]? inequalities = null)
    {
        var indicatorData = await _indicatorsService.GetIndicatorDataAsync(
            indicatorId,
            areaCodes ?? [],
            years ?? [],
            inequalities ?? []
            );

        return !indicatorData.Any() ? NotFound() : Ok(indicatorData);
    }
}
