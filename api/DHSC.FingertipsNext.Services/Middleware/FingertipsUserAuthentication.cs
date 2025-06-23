using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Services.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Identity.Web;

namespace DHSC.FingertipsNext.Services.Middleware
{
    public static class FingertipsUserAuthentication
    {
        public static IServiceCollection AddFingertipsUserAuth(this IServiceCollection collection, ConfigurationManager config)
        {
            collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(config)
                .EnableTokenAcquisitionToCallDownstreamApi()
                .AddInMemoryTokenCaches();

            collection.AddTransient<IAuthorizationHandler, IndicatorAdministrationAuthHandler>();

            collection.AddAuthorization(options =>
            {
                options.AddPolicy(CanAdministerIndicatorRequirement.PolicyName, policy =>
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
