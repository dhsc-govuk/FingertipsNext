using System.Net;
using System.Net.Http.Headers;
using DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.HealthData;

public sealed class HealthDataIntegrationTests : IClassFixture<DataManagementWebApplicationFactory<Program>>
{
    private readonly DataManagementWebApplicationFactory<Program> _factory;
    private const int IndicatorId = 41101;
    private const string AdminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
    private const string Indicator41101GroupRoleId = "90ac52f4-8513-4050-873a-24340bc89bd3";

    public HealthDataIntegrationTests(DataManagementWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _factory.AdminRoleGuid = AdminRoleGuid;
    }

    [Fact]
    public async Task GetIndicatorDataIncludingUnpublishedWithoutAuth401Response()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(new Uri($"/indicators/{IndicatorId}/data/all", UriKind.Relative));

        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetIndicatorDataIncludingUnpublishedWithInvalidAuth403Response()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken());

        using var req = new HttpRequestMessage(HttpMethod.Get, new Uri($"/indicators/{IndicatorId}/data/all", UriKind.Relative));
        var response = await client.SendAsync(req);

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task GetIndicatorDataIncludingUnpublishedWithValidAuth200ResponseWithExpectedBody(string userRoleId)
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        // Act
        using var req = new HttpRequestMessage(HttpMethod.Get, new Uri($"/indicators/{IndicatorId}/data/all", UriKind.Relative));
        var response = await client.SendAsync(req);

        // Assert
        response.EnsureSuccessStatusCode();
    }
}