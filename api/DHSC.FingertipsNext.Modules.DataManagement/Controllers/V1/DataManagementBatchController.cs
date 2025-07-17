using System.Text.RegularExpressions;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.HealthData.Service;
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

    [HttpDelete]
    [Route("{batchId}")]
    [ProducesResponseType(typeof(void), StatusCodes.Status204NoContent)]
    public async Task<IActionResult> DeleteBatch([FromRoute] string batchId)
    {
        if (string.IsNullOrEmpty(batchId))
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "batchId is required"
            });

        //TODO: Add user ID
        var result = await dataManagementService.DeleteBatchAsync(batchId, Guid.Empty);

        var message = "";
        message = result.Errors == null ? "An unexpected error occurred" : result.Errors.FirstOrDefault();

        switch (result.Outcome)
        {
            case OutcomeType.Ok:
                return new AcceptedResult
                {
                    StatusCode = StatusCodes.Status204NoContent,
                    Value = result.Model
                };
            case OutcomeType.ClientError:
                if (message == "Not found")
                    return new NotFoundObjectResult(new SimpleError { Message = message });
                return new BadRequestObjectResult(new SimpleError { Message = message ?? "Invalid request" });
            case OutcomeType.ServerError:
            default:
                return StatusCode(StatusCodes.Status500InternalServerError, message);
        }
    }
}