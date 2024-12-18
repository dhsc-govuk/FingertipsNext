using DHSC.FingertipsNext.Modules.Core.Service;
using DHSC.FingertipsNext.Modules.Repository;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthMeasureController : ControllerBase
{

    private readonly IHealthMeasureService healthMeasureService;

    public HealthMeasureController(IHealthMeasureService healthMeasureService)
    {
        this.healthMeasureService = healthMeasureService;
    }

    [HttpGet(Name = "HealthMeasure")]
    public async Task<HealthMeasure> Get()
    {
        return await healthMeasureService.GetFirstHealthMeasure();
    }
}