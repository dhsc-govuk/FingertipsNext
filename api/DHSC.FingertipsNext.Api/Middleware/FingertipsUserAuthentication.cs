using DHSC.FingertipsNext.Api.Services;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Extensions.DependencyInjection.Extensions;
using Microsoft.Identity.Web;

namespace DHSC.FingertipsNext.Api.Middleware
{
    internal static class FingertipsUserAuthentication
    {
        public static IServiceCollection AddFingertipsUserAuth(this IServiceCollection collection, ConfigurationManager config)
        {
            // If config doesn't have the AzureAD config setting, this stops the authentication middleware from loading and crashing at startup
            // Temporary until we have a more robust solution.
            if (config.GetSection("AzureAD:Instance").Value != null)
            {
                collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApi(config)
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddInMemoryTokenCaches();
            }
#if DEBUG
            else if (config.GetSection("Authentication:Schemes:Bearer:ValidIssuer").Value != null)
            {
                collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme).AddJwtBearer();
            }
#endif

            collection.TryAddSingleton<IHttpContextAccessor, HttpContextAccessor>();

            collection.AddAuthorization(options =>
            {
                options.AddPolicy(CanAdministerIndicatorRequirement.Policy, policy =>
                    policy.Requirements.Add(new CanAdministerIndicatorRequirement()));
            });

            collection.AddTransient<IAuthorizationHandler, ShouldBeAnAdministratorRequirementHandler>();
            collection.AddTransient<IAuthorizationHandler, UserHasIndicatorManagementRolesRequirementHandler>();

            return collection;
        }

        public static IApplicationBuilder UseFingerprintsAuth(this IApplicationBuilder app)
        {
            app.UseAuthentication();

            app.UseAuthorization();

            return app;
        }
    }
}
