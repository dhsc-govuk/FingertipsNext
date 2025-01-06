using DHSC.FingertipsNext.Modules.HealthData.Schemas;
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
    /// <returns></returns>
    /// <remarks>
    /// If more than 10 years are supplied only data for the first 10 distinct years will be returned.
    /// If more than 10 area codes are supplied only data for the first 10 distinct area codes will be returned.
    /// </remarks>
    [HttpGet]
    [Route("{indicatorId}/data/V1")]
    public async Task<HealthDataForArea[]> GetIndicatorData(
        [FromRoute] int indicatorId,
        [FromQuery] string[]? areaCodes = null,
        [FromQuery] int[]? years = null
    )
    {
        var indicatorData = await _indicatorsService.GetIndicatorData(
            indicatorId,
            areaCodes ?? [],
            years ?? []
        );

        return indicatorData.ToArray();
    }

    [HttpGet]
    [Route("{indicatorId}/data")]
    public IActionResult GetIndcatorData_(
        [FromRoute] int indicatorId,
        [FromQuery] string[]? areaCodes = null,
        [FromQuery] int[]? years = null)
    {
        var indicatorData = _indicatorsService.GetIndicatorData_(
            indicatorId,
            areaCodes ?? [],
            years ?? []
            ).ToArray();

        return indicatorData.Length == 0 ? NotFound() : Ok(indicatorData);
    }
}
