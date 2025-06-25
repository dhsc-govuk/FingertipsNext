using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authorization;

namespace DHSC.FingertipsNext.Api.Services
{
    internal sealed class ShouldBeAnAdministratorRequirementHandler(IConfiguration config) : AuthorizationHandler<CanAdministerIndicatorRequirement>
    {
        protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, CanAdministerIndicatorRequirement requirement)
        {
            var adminRole = config["AdminRole"];

            if (!string.IsNullOrWhiteSpace(adminRole))
            {
                if (context.User.IsInRole(adminRole))
                {
                    context.Succeed(requirement);
                }
            }

            return Task.CompletedTask;
        }
    }
}
