using DHSC.FingertipsNext.Modules.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class FirstHealthMeasureController : ControllerBase
{

    private readonly IHealthMeasureService _healthMeasureService;

    public FirstHealthMeasureController(IHealthMeasureService healthMeasureService)
    {
        _healthMeasureService = healthMeasureService;
    }

    [HttpGet(Name = "GetFirstHealthMeasure")]
    public IActionResult GetFirstHealthMeasure()
    {
        var healthMeasure = _healthMeasureService.GetFirstHealthMeasure();
        return healthMeasure == null ? NotFound() : Ok(healthMeasure);
    }
}