using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService) : ControllerBase
{
    private const int MaxNumberAreas = 10;
    private const int MaxNumberYears = 10;
    private const string TooManyParametersMessage = "Too many values supplied for parameter {0}. The maximum is 10 but {1} supplied.";
    private readonly IIndicatorsService _indicatorsService = indicatorsService;

    /// <summary>
    /// Get data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 10 distinct area codes can be requested.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="years">A list of years. Up to 10 distinct years can be requested.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 10 years are supplied the request will fail.
    /// If more than 10 area codes are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("{indicatorId:int}/data")]
    [ProducesResponseType(typeof(IndicatorWithHealthDataForAreas), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIndicatorDataAsync(
        [FromRoute] int indicatorId,
        [FromQuery(Name = "area_codes")] string[]? areaCodes = null,
        [FromQuery(Name = "area_type")] string areaType = "",
        [FromQuery] int[]? years = null,
        [FromQuery] string[]? inequalities = null)
    {
        if(areaCodes is { Length: > MaxNumberAreas })
            return new BadRequestObjectResult(new SimpleError { Message = $"Too many values supplied for parameter area_codes. The maximum is {MaxNumberAreas} but {areaCodes.Length} supplied." });

        if (years is { Length: > MaxNumberYears })
            return new BadRequestObjectResult(new SimpleError { Message = $"Too many values supplied for parameter years. The maximum is {MaxNumberYears} but {years.Length} supplied." });

        var indicatorData = await _indicatorsService.GetIndicatorDataAsync
        (
            indicatorId,
            areaCodes ?? [],
            areaType,
            years ?? [],
            inequalities ?? []
        );

        return indicatorData == null ? NotFound() : Ok(indicatorData);
    }
}
