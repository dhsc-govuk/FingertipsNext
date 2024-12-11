using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Indicators.Controllers.V1;

[ApiController]
[Route("indicators")]
public class IndicatorsController : ControllerBase, IIndicatorsController
{
    [HttpGet]
    [Route("{indicatorId}/data")]
    public HealthDataForArea[] GetIndicatorData([FromRoute] int indicatorId, [FromQuery] string[]? areaCodes = null, [FromQuery] int[]? years = null)
    {
        return
        [
            new HealthDataForArea { AreaCode = "AA1 1AA", HealthData = 
            [
                new HealthDataPoint { Year = 1999, Count = 1, Value = 2, LowerConfidenceInterval = 3, UpperConfidenceInterval = 4 }
            ] }
        ];
    }
}