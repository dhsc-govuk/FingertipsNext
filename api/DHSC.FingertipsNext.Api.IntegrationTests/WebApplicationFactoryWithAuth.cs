using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using DotNetEnv;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Time.Testing;
using Microsoft.IdentityModel.Tokens;

namespace DHSC.FingertipsNext.Api.IntegrationTests;

public class WebApplicationFactoryWithAuth<T> : WebApplicationFactory<T> where T : class
{
    private const string JwtStubIssuer = "TestIssuer";
    private const string JwtStubAudience = "TestAudience";

    public FakeTimeProvider MockTime { get; } = new();

    public string? AdminRoleGuid { get; set; }

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        Env.Load(string.Empty, new LoadOptions(true, true, false));

        builder.ConfigureTestServices(services => { services.AddSingleton<TimeProvider>(MockTime); }).ConfigureTestServices(services =>
        {
            // Remove the existing authentication schemes if necessary
            services.AddAuthentication("TestScheme")
                .AddJwtBearer("TestScheme", options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters
                    {
                        ValidateIssuer = true,
                        ValidateAudience = true,
                        ValidateLifetime = true,
                        ValidateIssuerSigningKey = true,
                        ValidIssuer = JwtStubIssuer,
                        ValidAudience = JwtStubAudience,
                        IssuerSigningKey = new SymmetricSecurityKey(new byte[256]),
                        ClockSkew = TimeSpan.Zero
                    };
                });
        }).ConfigureAppConfiguration((_, config) =>
        {
            config.AddInMemoryCollection(new Dictionary<string, string?>
            {
                ["ADMINROLE"] = AdminRoleGuid
            });
        });
    }

    public string GenerateTestToken(string[]? includeRoleClaims = null, bool tokenIsExpired = false, bool tokenContainsSubClaim = true)
    {
        var claims = new List<Claim>();

        if (tokenContainsSubClaim)
        {
            claims.Add(new Claim(JwtRegisteredClaimNames.Sub, "test-user"));
        }

        if (includeRoleClaims != null)
        {
            foreach (var claim in includeRoleClaims)
            {
                claims.Add(new Claim(ClaimTypes.Role, claim));
            }
        }

        var tokenExpiry = DateTime.UtcNow.AddMinutes(30);

        if (tokenIsExpired)
        {
            tokenExpiry = DateTime.UtcNow.AddMinutes(-1);
        }

        var key = new SymmetricSecurityKey(new byte[256]);
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: JwtStubIssuer,
            audience: JwtStubAudience,
            claims: claims,
            expires: tokenExpiry,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}