using System.Net;
using System.Net.Http.Headers;
using System.Text.Json;
using DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.HealthData;

public sealed class HealthDataIntegrationTests : IClassFixture<WebApplicationFactoryWithAuth<Program>>
{
    private readonly WebApplicationFactoryWithAuth<Program> _factory;
    private const int IndicatorId = 41101;
    private const string AdminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
    private const string Indicator90453GroupRoleId = "2259ddee-6473-4296-9b0c-fa87751f5c34";
    private const string Indicator41101GroupRoleId = "90AC52F4-8513-4050-873A-24340BC89BD3";

    public HealthDataIntegrationTests(WebApplicationFactoryWithAuth<Program> factory)
    {
        _factory = factory;
        _factory.AdminRoleGuid = AdminRoleGuid;
    }

    [Fact]
    public async Task GetQuartilesAllShouldRespondWith401WithoutAuth()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&area_code=N85008&area_type=gps&ancestor_code=U79121",  UriKind.Relative));
        
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetQuartilesAllShouldRespondWith401WhenTokenIsExpired()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([AdminRoleGuid], tokenIsExpired: true));
        
        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));
        
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task GetQuartilesAllShouldRespondWith403WhenRoleIsMissing()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken());
        
        var response  = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));
        
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(Indicator90453GroupRoleId)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task GetQuartilesAllShouldRespondWith403WhenRoleLacksAccessToIndicator(params string[] userRoleIds)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken(userRoleIds));
        
        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&indicator_ids=90453&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));
        
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }
}