using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Api.Controllers;

[ApiController]
[Route("[controller]")]
public class HealthCheckController : ControllerBase
{
    [HttpGet(Name = "GetHealthCheck")]
    public IActionResult Get()
    {
        return Ok(new { status = "Healthy" });
    }
}