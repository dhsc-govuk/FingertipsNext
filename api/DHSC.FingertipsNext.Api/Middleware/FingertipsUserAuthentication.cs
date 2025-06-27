using DHSC.FingertipsNext.Api.Services;
using DHSC.FingertipsNext.Modules.Common.Auth;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.Identity.Web;

namespace DHSC.FingertipsNext.Api.Middleware
{
    internal static class FingertipsUserAuthentication
    {
        public static IServiceCollection AddFingertipsUserAuth(this IServiceCollection collection, ConfigurationManager config)
        {
            // If config doesnt have the AzureAD config setting, this stops the authentication middleware from loading and crashing at startup
            // Temporary until we have a more robust solution.
            if (config.GetSection("AzureAD").Value != null)
            {
                collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                    .AddMicrosoftIdentityWebApi(config)
                    .EnableTokenAcquisitionToCallDownstreamApi()
                    .AddInMemoryTokenCaches();
            }

            collection.AddAuthorization(options =>
            {
                options.AddPolicy(CanAdministerIndicatorRequirement.Policy, policy =>
                    policy.Requirements.Add(new CanAdministerIndicatorRequirement()));
            });

            collection.AddTransient<IAuthorizationHandler, ShouldBeAnAdministratorRequirementHandler>();

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
