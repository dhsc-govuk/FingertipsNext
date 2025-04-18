﻿using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService) : ControllerBase
{
    private const int MaxNumberAreas = 100;
    private const int MaxNumberYears = 20;
    private const int MaxNumberIndicators = 50;

    private readonly IIndicatorsService _indicatorsService = indicatorsService;

    /// <summary>
    /// Get data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 100 distinct area codes can be requested.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="years">A list of years. Up to 20 distinct years can be requested.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <param name="include_empty_areas">Determines if areas with no data are returned as empty arrays, the default is false.</param>
    /// <param name="latest_only">Set to true to get data for the latest date period only, default is false. This overrides the years parameter if set to true</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 20 years are supplied the request will fail.
    /// If more than 100 area codes are supplied the request will fail.
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
        [FromQuery] string[]? inequalities = null,
        [FromQuery] bool include_empty_areas =false,
        [FromQuery] bool latest_only = false)
    {
        if (areaCodes is {Length: > MaxNumberAreas})
            return new BadRequestObjectResult(new SimpleError
            {
                Message =
                    $"Too many values supplied for parameter area_codes. The maximum is {MaxNumberAreas} but {areaCodes.Length} supplied."
            });

        if (years is {Length: > MaxNumberYears})
            return new BadRequestObjectResult(new SimpleError
            {
                Message =
                    $"Too many values supplied for parameter years. The maximum is {MaxNumberYears} but {years.Length} supplied."
            });

        var indicatorData = await _indicatorsService.GetIndicatorDataAsync
        (
            indicatorId,
            areaCodes ?? [],
            areaType,
            years ?? [],
            inequalities ?? [],
            include_empty_areas,
            latest_only
        );

        return indicatorData?.Status switch
        {
            ResponseStatus.Success => Ok(indicatorData?.Content),
            ResponseStatus.NoDataForIndicator => Ok(indicatorData?.Content),
            ResponseStatus.IndicatorDoesNotExist => NotFound(),
            _ => StatusCode(500)
        };
    }

    /// <summary>
    /// Get data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorIds">The unique identifier of the indicator.</param>
    /// <param name="areaCode">A list of area codes.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="ancestorCode">A list of desired inequalities.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 50 indicators are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("quartiles")]
    [ProducesResponseType(typeof(List<Schemas.IndicatorQuartileData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetQuartileDataAsync(
        [FromQuery(Name = "indicator_ids")] int[]? indicatorIds = null,
        [FromQuery(Name = "area_code")] string areaCode = "",
        [FromQuery(Name = "area_type")] string areaType = null,
        [FromQuery(Name = "ancestor_code")] string ancestorCode = "")
    {
        if (indicatorIds is null)
            return new BadRequestObjectResult(new SimpleError { Message = $"Parameter indicator_ids must be supplied." });

        if (indicatorIds is { Length: > MaxNumberIndicators })
            return new BadRequestObjectResult(new SimpleError { Message = $"Too many values supplied for parameter indicator_ids. The maximum is {MaxNumberIndicators} but {indicatorIds.Length} supplied." });

        if (areaType is null)
            return new BadRequestObjectResult(new SimpleError { Message = $"Parameter area_type must be supplied." });

        var quartileData = await _indicatorsService.GetQuartileDataAsync
        (
            indicatorIds,
            areaCode,
            areaType,
            ancestorCode
        );

        return quartileData == null ? NotFound() : Ok(quartileData);
    }
}
