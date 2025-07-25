using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers;

internal abstract class AuthUtilities
{
    public static List<Guid> GetRoles(ClaimsPrincipal user)
    {
        var userRoleIds = user.FindAll(ClaimTypes.Role).Select(c => c.Value).ToArray();
        var userRoles = new List<Guid>();

        foreach (var id in userRoleIds)
            if (Guid.TryParse(id, out var roleGuid))
            {
                userRoles.Add(roleGuid);
            }

        return userRoles;
    }

    public static async Task<int[]> GetIndicatorIdsFromRoles(IIndicatorPermissionsLookupService indicatorPermissionsLookupService,
        IEnumerable<Guid> roles)
    {
        var userIndicatorPermissions = await indicatorPermissionsLookupService.GetIndicatorsForRoles(roles);

        return userIndicatorPermissions.ToArray();
    }

    public static string? GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }
}