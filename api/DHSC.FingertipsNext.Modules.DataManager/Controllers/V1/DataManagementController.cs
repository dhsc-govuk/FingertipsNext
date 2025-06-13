using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("data_management")]
public class DataManagementController(IDataManagementService dataManagementService) : ControllerBase
{
    /// <summary>
    /// Simple endpoint to implement testable module skeleton
    /// </summary>
    /// <returns></returns>
    [HttpGet]
    [ProducesResponseType(typeof(string), StatusCodes.Status200OK)]
    public ActionResult Healthcheck()
    {
        return Ok(dataManagementService.SayHelloToRepository());
    }
}
