using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Infrastructure;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService) : ControllerBase
{
    private const int MaxParamArrayLength = 10;
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
    /// <param name="comparison_method">eg RAG, Quartiles</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 10 years are supplied the request will fail.
    /// If more than 10 area codes are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("{indicatorId:int}/data")]
    [ProducesResponseType(typeof(HealthDataForArea[]), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetIndicatorDataAsync(
        [FromRoute] int indicatorId,
        [FromQuery(Name = "area_codes")] string[]? areaCodes = null,
        [FromQuery(Name = "area_type")] string areaType = "",
        [FromQuery] int[]? years = null,
        [FromQuery] string[]? inequalities = null,
        [FromQuery] string? comparison_method = "None")
    {
        if (areaCodes is { Length: > MaxParamArrayLength })
        {
            return new BadRequestObjectResult(
                new SimpleError { Message = string.Format(TooManyParametersMessage, "area_codes", areaCodes.Length) }
            );
        }

        if (years is { Length: > MaxParamArrayLength })
        {
            return new BadRequestObjectResult(
                new SimpleError { Message = string.Format(TooManyParametersMessage, "years", years.Length) }
            );
        }

        var comparisonMethodParsed= Enum.TryParse(comparison_method, true, out BenchmarkComparisonMethod benchmarkType);
        if (!comparisonMethodParsed)
            benchmarkType = BenchmarkComparisonMethod.None;

        var indicatorData = await _indicatorsService.GetIndicatorDataAsync(
            indicatorId,
            areaCodes ?? [],
            areaType,
            years ?? [],
            inequalities ?? [],
            benchmarkType
        );

        Console.WriteLine(indicatorData.Any() ? "FOUND" : "NOT FOUND");

        return !indicatorData.Any() ? NotFound() : Ok(indicatorData);
    }
}
