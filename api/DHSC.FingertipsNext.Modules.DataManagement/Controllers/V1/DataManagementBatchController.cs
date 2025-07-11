using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("batches")]
public class DataManagementBatchController(IDataManagementService dataManagementService) : ControllerBase
{
    /// <summary>
    ///     Get details of all health data upload batches that are for indicators that you have permissions to modify.
    /// </summary>
    /// <returns>Batches for indicators you have permissions to modify.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(Batch[]), StatusCodes.Status200OK)]
    public async Task<IActionResult> ListBatches()
    {
        // The indicator IDs a user has access to will be determined based on their authorisation roles in a subsequent change.
        int[] indicatorIds = [];

        return new OkObjectResult(await dataManagementService.ListBatches(indicatorIds));
    }
}