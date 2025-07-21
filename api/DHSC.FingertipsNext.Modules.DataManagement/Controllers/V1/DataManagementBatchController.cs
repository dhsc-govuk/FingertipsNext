using DHSC.FingertipsNext.Modules.Common.Schemas;
using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.HealthData.Service;
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

    private static List<Guid> GetRoles(ClaimsPrincipal user)
    {
        var userRoleIds = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        var userRoles = new List<Guid>();

        foreach (var id in userRoleIds)
            if (Guid.TryParse(id, out var roleGuid))
                userRoles.Add(roleGuid);

        return userRoles;
    }

    private async Task<int[]> GetIndicatorIdsFromRoles(IEnumerable<Guid> roles)
    {
        var userIndicatorPermissions = await _indicatorPermissionsLookupService.GetIndicatorsForRoles(roles);

        return userIndicatorPermissions.ToArray();
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
        var userRoles = GetRoles(User);
        var userIndicatorPermissions = await GetIndicatorIdsFromRoles(userRoles);

        if (userIndicatorPermissions.Length == 0 && !User.IsInRole(_adminRole)) return new ForbidResult();

        // If a user is an admin we ignore any other permissions they may have.
        if (User.IsInRole(_adminRole)) userIndicatorPermissions = [];

        return new OkObjectResult(await _dataManagementService.ListBatches(userIndicatorPermissions));
    }

    [HttpDelete]
    [Route("{batchId}")]
    [ProducesResponseType(typeof(void), StatusCodes.Status200OK)]
    public async Task<IActionResult> DeleteBatch([FromRoute] string batchId)
    {
        if (string.IsNullOrEmpty(batchId))
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "batchId is required"
            });

        // User ID will be added under DHSCFT-930
        var result = await _dataManagementService.DeleteBatchAsync(batchId, Guid.Empty);

        var message = result.Errors == null ? "An unexpected error occurred" : result.Errors.FirstOrDefault();

        switch (result.Outcome)
        {
            case OutcomeType.Ok:
                return new OkObjectResult(result.Model);
            case OutcomeType.NotFound:
                return new NotFoundResult();
            case OutcomeType.ClientError:
                return new BadRequestObjectResult(new SimpleError { Message = message ?? "Invalid request" });
            case OutcomeType.ServerError:
            default:
                return StatusCode(StatusCodes.Status500InternalServerError, message);
        }
    }
}