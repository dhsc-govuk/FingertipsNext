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
            collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(config)
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddInMemoryTokenCaches();

            collection.AddTransient<IAuthorizationHandler, ShouldBeAnAdministratorRequirementHandler>();

            collection.AddAuthorization(options =>
            {
                options.AddPolicy(CanAdministerIndicatorRequirement.Policy, policy =>
                    policy.Requirements.Add(new CanAdministerIndicatorRequirement()));
            });

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
