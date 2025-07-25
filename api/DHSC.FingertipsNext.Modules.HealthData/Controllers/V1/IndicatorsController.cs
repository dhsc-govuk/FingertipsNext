using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System.Globalization;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService) : ControllerBase
{
    private const int MaxNumberAreas = 300;
    private const int MaxNumberYears = 20;
    private const int MaxNumberIndicators = 50;

    private readonly IIndicatorsService _indicatorsService = indicatorsService;

    /// <summary>
    /// Get published data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 100 distinct area codes can be requested.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="ancestorCode">Optional Ancestor Code used for benchmarking.</param>
    /// <param name="benchmarkRefType">Optional benchmark reference type.</param>
    /// <param name="years">A list of years. Up to 20 distinct years can be requested.</param>
    /// <param name="fromDate">The earliest date data can be for, inclusive.</param>
    /// <param name="toDate">The latest date data can be for, inclusive.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <param name="latestOnly">Set to true to get data for the latest date period only, default is false. This overrides the years parameter if set to true</param>
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
    public async Task<IActionResult> GetPublishedIndicatorDataAsync(
        [FromRoute] int indicatorId,
        [FromQuery(Name = "area_codes")] string[]? areaCodes = null,
        [FromQuery(Name = "area_type")] string areaType = "",
        [FromQuery(Name = "ancestor_code")] string ancestorCode = "",
        [FromQuery(Name = "benchmark_ref_type")]
            BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.Unknown,
        [FromQuery] int[]? years = null,
        [FromQuery(Name = "from_date")] string? fromDateStr = null,
        [FromQuery(Name = "to_date")] string? toDateStr = null,
        [FromQuery] string[]? inequalities = null,
        [FromQuery(Name = "latest_only")] bool latestOnly = false
    ) => await GetIndicatorDataInternalAsync(
            indicatorId,
            areaCodes,
            areaType,
            ancestorCode,
            benchmarkRefType,
            years,
            fromDateStr,
            toDateStr,
            inequalities,
            latestOnly,
            false);

    /// <summary>
    /// Get published and unpublished data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 100 distinct area codes can be requested.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="ancestorCode">Optional Ancestor Code used for benchmarking.</param>
    /// <param name="benchmarkRefType">Optional benchmark reference type.</param>
    /// <param name="years">A list of years. Up to 20 distinct years can be requested.</param>
    /// <param name="fromDate">The earliest date data can be for, inclusive.</param>
    /// <param name="toDate">The latest date data can be for, inclusive.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <param name="latestOnly">Set to true to get data for the latest date period only, default is false. This overrides the years parameter if set to true</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 20 years are supplied the request will fail.
    /// If more than 100 area codes are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("{indicatorId:int}/data/all")]
    [ProducesResponseType(typeof(IndicatorWithHealthDataForAreas), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [Authorize(Policy = CanAdministerIndicatorRequirement.Policy)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetPublishedAndUnpublishedIndicatorDataAsync(
        [FromRoute] int indicatorId,
        [FromQuery(Name = "area_codes")] string[]? areaCodes = null,
        [FromQuery(Name = "area_type")] string areaType = "",
        [FromQuery(Name = "ancestor_code")] string ancestorCode = "",
        [FromQuery(Name = "benchmark_ref_type")]
            BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.Unknown,
        [FromQuery] int[]? years = null,
        [FromQuery(Name = "from_date")] string? fromDateStr = null,
        [FromQuery(Name = "to_date")] string? toDateStr = null,
        [FromQuery] string[]? inequalities = null,
        [FromQuery(Name = "latest_only")] bool latestOnly = false
    ) => await GetIndicatorDataInternalAsync(
            indicatorId,
            areaCodes,
            areaType,
            ancestorCode,
            benchmarkRefType,
            years,
            fromDateStr,
            toDateStr,
            inequalities,
            latestOnly,
            true);

    /// <summary>
    /// Get published data for a public health indicator. Returns all published data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="areaCode">A list of area codes.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="ancestorCode">The area group for calculating quartiles within.</param>
    /// <param name="benchmarkRefType">Whether to benchmark against England or SubNational.</param>
    /// <param name="indicatorIds">The unique identifier of the indicator.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 50 indicators are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("quartiles")]
    [ProducesResponseType(typeof(List<Schemas.IndicatorQuartileData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    public async Task<IActionResult> GetPublishedQuartileDataAsync(
        [FromQuery(Name = "indicator_ids")] int[]? indicatorIds = null,
        [FromQuery(Name = "area_code")] string areaCode = "",
        [FromQuery(Name = "area_type")] string? areaType = null,
        [FromQuery(Name = "ancestor_code")] string ancestorCode = "",
        [FromQuery(Name = "benchmark_ref_type")] BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.England
        ) => await GetQuartileDataInternalAsync(
            indicatorIds,
            areaCode,
            areaType,
            ancestorCode,
            benchmarkRefType,
            false);

    /// <summary>
    /// Get published and unpublished data for a public health indicator. Returns all published and unpublished data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="areaCode">A list of area codes.</param>
    /// <param name="areaType">The area type the area codes belong to.</param>
    /// <param name="ancestorCode">The area group for calculating quartiles within.</param>
    /// <param name="benchmarkRefType">Whether to benchmark against England or SubNational.</param>
    /// <param name="indicatorIds">The unique identifier of the indicator.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 50 indicators are supplied the request will fail.
    /// </remarks>
    [HttpGet]
    [Route("quartiles/all")]
    [Authorize(Policy = CanAdministerIndicatorRequirement.Policy)]
    [ProducesResponseType(typeof(List<Schemas.IndicatorQuartileData>), StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status404NotFound)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> GetPublishedAndUnpublishedQuartileDataAsync(
        [FromQuery(Name = "indicator_ids")] int[]? indicatorIds = null,
        [FromQuery(Name = "area_code")] string areaCode = "",
        [FromQuery(Name = "area_type")] string? areaType = null,
        [FromQuery(Name = "ancestor_code")] string ancestorCode = "",
        [FromQuery(Name = "benchmark_ref_type")] BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.England
        ) => await GetQuartileDataInternalAsync(
            indicatorIds,
            areaCode,
            areaType,
            ancestorCode,
            benchmarkRefType,
            true);

    private async Task<IActionResult> GetQuartileDataInternalAsync(
        int[]? indicatorIds = null,
        string areaCode = "",
        string? areaType = null,
        string ancestorCode = "",
        BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.England,
        bool includeUnpublished = false
        )
    {
        if (indicatorIds is null)
            return new BadRequestObjectResult(new SimpleError { Message = $"Parameter indicator_ids must be supplied." });

        if (indicatorIds is { Length: > MaxNumberIndicators })
            return new BadRequestObjectResult(new SimpleError { Message = $"Too many values supplied for parameter indicator_ids. The maximum is {MaxNumberIndicators} but {indicatorIds.Length} supplied." });

        if (areaType is null)
            return new BadRequestObjectResult(new SimpleError { Message = $"Parameter area_type must be supplied." });

        if ((benchmarkRefType == BenchmarkReferenceType.SubNational) && string.IsNullOrEmpty(ancestorCode))
            return new BadRequestObjectResult(new SimpleError { Message = $"Parameter ancestor_code must be supplied if benchmark_ref_type is set to SubNational." });

        var quartileData = await _indicatorsService.GetQuartileDataAsync(
            indicatorIds,
            areaCode,
            areaType,
            ancestorCode,
            benchmarkRefType == BenchmarkReferenceType.SubNational ? ancestorCode : "E92000001",
            includeUnpublished
        );

        return quartileData == null ? NotFound() : Ok(quartileData);
    }

    private async Task<IActionResult> GetIndicatorDataInternalAsync(
        int indicatorId,
        string[]? areaCodes = null,
        string areaType = "",
        string ancestorCode = "",
        BenchmarkReferenceType benchmarkRefType = BenchmarkReferenceType.Unknown,
        int[]? years = null,
        string? fromDateStr = null,
        string? toDateStr = null,
        string[]? inequalities = null,
        bool latestOnly = false,
        bool includeUnpublished = false
    )
    {
        if (areaCodes is { Length: > MaxNumberAreas })
            return new BadRequestObjectResult(
                new SimpleError
                {
                    Message =
                        $"Too many values supplied for parameter area_codes. The maximum is {MaxNumberAreas} but {areaCodes.Length} supplied.",
                }
            );

        if (years is { Length: > MaxNumberYears })
            return new BadRequestObjectResult(
                new SimpleError
                {
                    Message =
                        $"Too many values supplied for parameter years. The maximum is {MaxNumberYears} but {years.Length} supplied.",
                }
            );

        DateOnly? toDate = null;
        if (toDateStr is not null)
        {
            try
            {
                toDate = DateOnly.Parse(toDateStr, CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                return new BadRequestObjectResult(
                    new SimpleError
                    {
                        Message = $"to_date {toDateStr} is invalid, should be formatted like 2023-06-20",
                    }
                );
            }
        }

        DateOnly? fromDate = null;
        if (fromDateStr is not null)
        {
            try
            {
                fromDate = DateOnly.Parse(fromDateStr, CultureInfo.InvariantCulture);
            }
            catch (FormatException)
            {
                return new BadRequestObjectResult(
                    new SimpleError
                    {
                        Message = $"from_date {fromDateStr} is invalid, should be formatted like 2023-06-20",
                    }
                );
            }
        }

        if ((benchmarkRefType == BenchmarkReferenceType.SubNational) && (string.IsNullOrEmpty(ancestorCode)))
            return new BadRequestObjectResult(
                new SimpleError
                {
                    Message =
                        $"Missing parameter 'ancestor_code'. When benchmark_ref_type is set to SubNational then the ancestor_code parameter must be set",
                }
            );

        var indicatorData = await _indicatorsService.GetIndicatorDataAsync(
            indicatorId,
            areaCodes ?? [],
            areaType,
            ancestorCode,
            benchmarkRefType,
            years ?? [],
            inequalities ?? [],
            latestOnly,
            fromDate,
            toDate,
            includeUnpublished
        );

        return indicatorData?.Status switch
        {
            ResponseStatus.Success => Ok(indicatorData?.Content),
            ResponseStatus.NoDataForIndicator => Ok(indicatorData?.Content),
            ResponseStatus.IndicatorDoesNotExist => NotFound(),
            _ => StatusCode(500),
        };
    }
}
