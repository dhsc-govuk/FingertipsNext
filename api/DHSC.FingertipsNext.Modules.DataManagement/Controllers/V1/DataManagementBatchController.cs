using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("batches")]
[Authorize]
public class DataManagementBatchController(IConfiguration configuration, IIndicatorPermissionsLookupService permissionsLookupService, IDataManagementService dataManagementService) : ControllerBase
{
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
        var roleIds = User.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        var userRoles = new List<Guid>();

        foreach (var id in roleIds)
            if (Guid.TryParse(id, out var roleGuid))
                userRoles.Add(roleGuid);

        var userIndicatorPermissions = await permissionsLookupService.GetIndicatorsForRoles(userRoles);
        var indicatorPermissionsArray = userIndicatorPermissions.ToArray();

        var adminRole = configuration["AdminRole"];
        ArgumentException.ThrowIfNullOrWhiteSpace(adminRole);

        if (indicatorPermissionsArray.Length == 0 && !User.IsInRole(adminRole)) return new ForbidResult();

        return new OkObjectResult(await dataManagementService.ListBatches(indicatorPermissionsArray));
    }
}