using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("batches")]
[Authorize]
public class DataManagementBatchController : ControllerBase
{
    private readonly string _adminRole;
    private readonly IDataManagementService _dataManagementService;
    private readonly IIndicatorPermissionsLookupService _indicatorPermissionsLookupService;

    public DataManagementBatchController(IConfiguration configuration, IIndicatorPermissionsLookupService permissionsLookupService, IDataManagementService dataManagementService)
    {
        ArgumentNullException.ThrowIfNull(configuration);
        var adminRole = configuration["AdminRole"];
        ArgumentException.ThrowIfNullOrWhiteSpace(adminRole);
        _adminRole = adminRole;

        _indicatorPermissionsLookupService = permissionsLookupService;
        _dataManagementService = dataManagementService;
    }

    /// <summary>
    ///     Get details of all health data upload batches that are for indicators that you have permissions to modify.
    /// </summary>
    /// <returns>Batches for indicators you have permissions to modify.</returns>
    [HttpGet]
    [ProducesResponseType(typeof(Batch[]), StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> ListBatches()
    {
        var userRoles = AuthUtilities.GetRoles(User);
        var indicatorIds = await AuthUtilities.GetIndicatorIdsFromRoles(_indicatorPermissionsLookupService, userRoles);

        if (indicatorIds.Length == 0 && !User.IsInRole(_adminRole))
        {
            return new ForbidResult();
        }

        // If a user is an admin we ignore any other permissions they may have.
        if (User.IsInRole(_adminRole))
        {
            indicatorIds = [];
        }

        return new OkObjectResult(await _dataManagementService.ListBatches(indicatorIds));
    }

    [HttpDelete]
    [Route("{batchId}")]
    [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteBatch([FromRoute] string batchId)
    {
        if (string.IsNullOrEmpty(batchId))
        {
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "batchId is required"
            });
        }

        var userRoles = AuthUtilities.GetRoles(User);
        var indicatorIds = await AuthUtilities.GetIndicatorIdsFromRoles(_indicatorPermissionsLookupService, userRoles);
        if (indicatorIds.Length == 0 && !User.IsInRole(_adminRole))
        {
            return new ForbidResult();
        }

        // If a user is an admin we ignore any other permissions they may have.
        if (User.IsInRole(_adminRole))
        {
            indicatorIds = [];
        }

        var userId = AuthUtilities.GetUserId(User);
        if (userId == null)
        {
            return new ForbidResult();
        }

        var result = await _dataManagementService.DeleteBatchAsync(batchId, userId, indicatorIds);

        var message = result.Errors == null ? "An unexpected error occurred" : result.Errors.FirstOrDefault();

        switch (result.Outcome)
        {
            case OutcomeType.Ok:
                return new OkObjectResult(result.Model);
            case OutcomeType.NotFound:
                return new NotFoundResult();
            case OutcomeType.ClientError:
                return new BadRequestObjectResult(new SimpleError { Message = message ?? "Invalid request" });
            case OutcomeType.PermissionDenied:
                return StatusCode(StatusCodes.Status403Forbidden, message);
            case OutcomeType.ServerError:
            default:
                return StatusCode(StatusCodes.Status500InternalServerError, message);
        }
    }
}