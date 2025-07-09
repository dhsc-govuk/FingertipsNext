using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Net.Http.Headers;
using System.Security.Claims;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.AspNetCore.TestHost;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.UserAuth;

public class UserAuthenticationIntegrationTests : IClassFixture<WebApplicationFactory<Program>>
{
    private const string JwtStubIssuer = "TestIssuer";
    private const string JwtStubAudience = "TestAudience";

    /// <summary>
    /// The entra group ID for the dev database for indicator 41101.
    /// If this value in the db changes, then this needs to be updated accordingly.
    /// </summary>
    private const string Indicator41101GroupRoleId = "6a953232-afad-4406-a457-9960eec316ac";

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
                            ValidIssuer = JwtStubIssuer,
                            ValidAudience = JwtStubAudience,
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
    public async Task UserInfoEndpointShouldHandleMissingIdentityClaimAsABadRequest()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken(tokenContainsSubClaim: false));

        var response = await client.GetAsync(new Uri("/user/info", UriKind.Relative));

        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
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
    public async Task IndicatorPermissionsEndpointRejectsNonAdminUsersFromViewingProtectedIndicators()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken());

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsAdminUsersToViewProtectedIndicators()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsUsersWithIndicatorPermissionsToViewProtectedIndicator()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointBlocksUsersWithDifferentRolePermissionFromViewingProtectedIndicator()
    {
        var unknownRoleId = "7b353232-afad-4406-a457-9960eec314cd";

        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([unknownRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/41101", UriKind.Relative));

        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointRejectsNonAdminUsersFromViewingProtectedIndicatorsViaQueryString()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken());

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsAdminUsersToViewProtectedIndicatorsViaQueryString()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsUsersWithIndicatorPermissionsToViewProtectedIndicatorViaQueryString()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointBlocksUsersWithDifferentRolePermissionFromViewingProtectedIndicatorViaQueryString()
    {
        var unknownRoleId = "7b353232-afad-4406-a457-9960eec314cd";

        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([unknownRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=41101", UriKind.Relative));

        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsUsersWithBothAdminAndIndicatorPermissionsToViewProtectedIndicators()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid, Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsUsersWithBothAdminAndIndicatorPermissionsToViewProtectedIndicatorsViaQueryString()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid, Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=41101", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointHandlesIndicatorManagerAttemptingToViewUnknownIndicatorId()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/9999999", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointHandlesAdministratorAttemptingToViewUnknownIndicatorId()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/9999999", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }


    [Fact]
    public async Task IndicatorPermissionsEndpointHandlesIndicatorManagerAttemptingToViewUnknownIndicatorIdViaQueryString()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([Indicator41101GroupRoleId]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=9999999", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointHandlesAdministratorAttemptingToViewUnknownIndicatorIdViaQueryString()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken([adminRoleGuid]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator?indicator_ids=9999999", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointRejectsNonAdminAuthenticatedUsersFromViewingProtectedIndicators()
    {
        var client = _appFactory.CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken());

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/123", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task IndicatorPermissionsEndpointPermitsAdminAuthenticatedUsersToViewProtectedIndicators()
    {
        var adminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
        var client = _appFactory.WithWebHostBuilder(b => b.UseSetting("AdminRole", adminRoleGuid)).CreateClient();

        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", GenerateTestToken(includeRoleClaims: [adminRoleGuid]));

        using var req = new HttpRequestMessage(HttpMethod.Head, new Uri("/user/indicator/123", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.OK);
    }

    private static string GenerateTestToken(string[]? includeRoleClaims = null, bool tokenIsExpired = false, bool tokenContainsSubClaim = true)
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

        DateTime tokenExpiry = DateTime.UtcNow.AddMinutes(30);

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