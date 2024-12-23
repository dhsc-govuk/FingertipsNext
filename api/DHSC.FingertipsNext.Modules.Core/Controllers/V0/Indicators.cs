using DHSC.FingertipsNext.Modules.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Core.Controllers.V0;

// this is a temporary controller to enable onward development and should be deprecated as soon as possible
[ApiController]
[Route("v0/indicators")]
public class Indicators : ControllerBase
{

    private readonly IIndicatorsService _indicatorsService;

    public Indicators(IIndicatorsService indicatorsService)
    {
        _indicatorsService = indicatorsService;
    }

    [HttpGet]
    [Route("{indicatorId:int}/data")]
    public IActionResult GetIndicatorData(
        [FromRoute] int indicatorId,
        [FromQuery] string[]? areaCodes = null,
        [FromQuery] int []? years = null
        )
    {
        var indicatorData = _indicatorsService.GetIndicatorData(indicatorId, areaCodes ?? [], years ?? []).ToArray();
        return indicatorData.Length == 0 ? NotFound() : Ok(indicatorData);
    }
}