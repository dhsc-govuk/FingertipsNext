using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;
using DHSC.FingertipsNext.Modules.Indicators.Services;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Indicators.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController(IIndicatorsService indicatorsService)
    : ControllerBase,
        IIndicatorsController
{
    readonly IIndicatorsService _indicatorsService = indicatorsService;

    [HttpGet]
    [Route("{indicatorId}/data")]
    public HealthDataForArea[] GetIndicatorData(
        [FromRoute] int indicatorId,
        [FromQuery] string[]? areaCodes = null,
        [FromQuery] int[]? years = null
    )
    {
        // TODO: do we prefer Distinct/Take to be performed in the service?
        return _indicatorsService
            .GetIndicatorData(
                indicatorId,
                (areaCodes ?? []).Distinct().Take(10).ToArray(),
                (years ?? []).Distinct().Take(10).ToArray()
            )
            .ToArray();
    }
}
