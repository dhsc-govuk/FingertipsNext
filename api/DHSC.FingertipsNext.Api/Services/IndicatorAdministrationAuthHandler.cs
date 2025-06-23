using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Api.Services
{
    internal sealed class IndicatorAdministrationAuthHandler(IConfiguration config) : AuthorizationHandler<CanAdministerIndicatorRequirement, string>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CanAdministerIndicatorRequirement requirement, string indicatorId)
        {
            var adminRole = config["AdminRole"];

            if (!string.IsNullOrWhiteSpace(adminRole))
            {
                if (context?.User.IsInRole(adminRole) ?? false)
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}
