using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Common.Auth
{
    public static class FingertipsUserAuthentication
    {
        public static IServiceCollection AddFingertipsUserAuthentication(this IServiceCollection collection)
        {
            collection.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
               .AddJwtBearer(jwtOptions =>
               {
                   jwtOptions.Authority = "https://{--your-authority--}";
                   jwtOptions.Audience = "https://{--your-audience--}";
               });

            return collection;
        }

    }
}
