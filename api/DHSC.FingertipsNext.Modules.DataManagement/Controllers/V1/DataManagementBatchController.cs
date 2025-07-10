using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("batches")]
[ProducesResponseType(typeof(Batch[]), StatusCodes.Status200OK)]
public class DataManagementBatchController(IDataManagementService dataManagementService) : ControllerBase
{
    [HttpGet]
    public async Task<IActionResult> ListBatches()
    {
        // The indicator IDs a user has access to will be determined based on their authorisation roles in a subsequent change.
        int[] indicatorIds = [];

        return new OkObjectResult(await dataManagementService.ListBatches(indicatorIds));
    }
}