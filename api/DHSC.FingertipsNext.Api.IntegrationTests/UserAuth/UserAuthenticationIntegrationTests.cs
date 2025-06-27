using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.UserAuth
{
    public class UserAuthenticationIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
    {
        private readonly WebApplicationFactory<Program> _appFactory;

        public UserAuthenticationIntegrationTests(WebApplicationFactory<Program> factory)
        {
            ArgumentNullException.ThrowIfNull(factory);

            _appFactory = factory.WithWebHostBuilder(builder =>
            {
                builder.ConfigureTestServices(services =>
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
                                ValidIssuer = "TestIssuer",
                                ValidAudience = "TestAudience",
                                IssuerSigningKey = new SymmetricSecurityKey(new byte[256]),
                                ClockSkew = TimeSpan.Zero
                            };
                        });
                });
            });
        }

        [Fact]
        public async Task UserInfoEndpointShouldRejectUnauthenticatedUsers()
        {
            var client = _appFactory.CreateClient();

            var response = await client.GetAsync(new Uri("/user/info", UriKind.Relative));

            response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task UserInfoEndpointShouldPermitAuthenticatedUsers()
        {
            var client = _appFactory.CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken());

            var response = await client.GetAsync(new Uri("/user/info", UriKind.Relative));

            response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        [Fact]
        public async Task UserInfoEndpointShouldRejectExpiredTokensFromAuthenticatedUsers()
        {
            var client = _appFactory.CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken(tokenIsExpired: true));

            var response = await client.GetAsync(new Uri("/user/info", UriKind.Relative));

            response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
        }

        [Fact]
        public async Task UserInfoEndpointRejectsNonAdminAuthenticatedUsersFromViewingProtectedIndicators()
        {
            var client = _appFactory.CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken());

            using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/123", UriKind.Relative));
            var response = await client.SendAsync(req);

            response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
        }

        [Fact]
        public async Task UserInfoEndpointPermitsAdminAuthenticatedUsersToViewProtectedIndicators()
        {
            var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
            var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

            client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken(adminRoleGuid));

            using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/123", UriKind.Relative));
            var response = await client.SendAsync(req);

            response.StatusCode.ShouldBe(HttpStatusCode.OK);
        }

        private static string GenerateTestToken(string? includeRoleClaim = null, bool tokenIsExpired = false)
        {
            var claims = new List<Claim>()
            {
                new Claim(JwtRegisteredClaimNames.Sub, "test-user"),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            };

            if (includeRoleClaim != null)
            {
                claims.Add(new Claim(ClaimTypes.Role, includeRoleClaim));
            }

            DateTime tokenExpiry = DateTime.UtcNow.AddMinutes(30);

            if (tokenIsExpired)
            {
                tokenExpiry = DateTime.UtcNow.AddMinutes(-1);
            }

            var key = new SymmetricSecurityKey(new byte[256]);
            var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

            var token = new JwtSecurityToken(
                issuer: "TestIssuer",
                audience: "TestAudience",
                claims: claims,
                expires: tokenExpiry,
                signingCredentials: creds
            );

            return new JwtSecurityTokenHandler().WriteToken(token);
        }
    }
}
