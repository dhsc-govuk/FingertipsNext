using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using System.Text.Json;
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
    [InlineData(Indicator90453GroupRoleId)]
    public async Task GetQuintileIndicatorDataIncludingUnpublishedWithValidAuth200ResponseAndExpectedYears(string userRoleId)
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));
        // Specific Uri used in order to replace http test
        const string targetUri = "/indicators/90453/data/all?area_codes=E38000101&area_type=gps&years=2025&years=2024&years=2023&years=2022&years=2021&years=2020&ancestor_code=E38000136&area_codes=E38000136&area_codes=E92000001&benchmark_ref_type=SubNational";
        var expectedYears = new List<int> { 2020, 2021, 2022, 2023, 2024, 2025 };

        // Act
        using var req = new HttpRequestMessage(HttpMethod.Get, new Uri(targetUri, UriKind.Relative));
        var response = await client.SendAsync(req);

        // Extract
        var responseContent = await response.Content.ReadAsStringAsync();
        var responseData = JsonSerializer.Deserialize<IndicatorWithHealthDataForAreas>(responseContent);
        var healthDataItems = responseData.AreaHealthData
                .ToList()[2]
                .IndicatorSegments.First()
                .HealthData;
        var healthDataYearList = healthDataItems.Select(healthDataPoint => healthDataPoint.Year).Distinct().ToList();

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        responseData.BenchmarkMethod.ToString().ShouldBe("Quintiles");
        healthDataYearList.Count.ShouldBe(expectedYears.Count);
        healthDataYearList.ShouldBe(expectedYears, ignoreOrder: true);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task GetNonQuintileIndicatorDataIncludingUnpublishedWithValidAuth200ResponseAndExpectedYears(string userRoleId)
    {
        // Arrange
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization =
            new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));
        // Specific Uri used in order to replace http test
        const string targetUri = "/indicators/41101/data/all?area_codes=E38000101&area_type=gps&years=2025&years=2024&years=2023&years=2022&years=2021&years=2020&ancestor_code=E38000136&area_codes=E38000136&area_codes=E92000001&benchmark_ref_type=SubNational";

        var expectedYears = new List<int> { 2020, 2021, 2022, 2023, 2024 };

        // Act
        using var req = new HttpRequestMessage(HttpMethod.Get, new Uri(targetUri, UriKind.Relative));
        var response = await client.SendAsync(req);

        // Extract
        var responseContent = await response.Content.ReadAsStringAsync();
        var responseData = JsonSerializer.Deserialize<IndicatorWithHealthDataForAreas>(responseContent);
        var healthDataItems = responseData.AreaHealthData
            .ToList()[0]
            .IndicatorSegments.First()
            .HealthData;
        var healthDataYearList = healthDataItems.Select(healthDataPoint => healthDataPoint.Year).Distinct().ToList();

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        responseData.BenchmarkMethod.ToString().ShouldBe("CIOverlappingReferenceValue95");
        healthDataYearList.Count.ShouldBe(expectedYears.Count);
        healthDataYearList.ShouldBe(expectedYears, ignoreOrder: true);
    }


    [Fact]
    public async Task GetQuartilesAllShouldRespondWith401WithoutAuth()
    {
        var client = _factory.CreateClient();

        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));

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

        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(Indicator90453GroupRoleId)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task GetQuartilesAllShouldRespondWith403WhenRoleLacksAccessToAllIndicators(string userRoleId)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        var response = await client.GetAsync(new Uri($"indicators/quartiles/all?indicator_ids={IndicatorId}&indicator_ids=90453&area_code=N85008&area_type=gps&ancestor_code=U79121", UriKind.Relative));

        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(AdminRoleGuid, 41101)]
    [InlineData(Indicator41101GroupRoleId, 41101)]
    [InlineData(Indicator90453GroupRoleId, 90453)]
    public async Task GetQuartilesAllShouldRespondWith200WhenAuthIsValid(string userRoleId, int indicatorId)
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        var response = await client.GetFromJsonAsync<List<IndicatorQuartileData>>(new Uri(
            $"indicators/quartiles/all?indicator_ids={indicatorId}&area_code=N85008&area_type=regions&ancestor_code=U79121&benchmark_ref_type=SubNational",
            UriKind.Relative));

        response.ShouldNotBeNull();
        response.All(quartileData => quartileData.IndicatorId == indicatorId).ShouldBeTrue();
    }

    [Fact]
    public async Task GetQuartilesAllShouldRespondWithUnpublishedData()
    {
        var client = _factory.CreateClient();
        client.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([Indicator90453GroupRoleId]));
        var indicatorId = 90453;
        
        var response = await client.GetFromJsonAsync<List<IndicatorQuartileData>>(new Uri(
            $"indicators/quartiles/all?indicator_ids={indicatorId}&area_code=K84031&area_type=gps&ancestor_code=E38000136",
            UriKind.Relative));

        var quartileData = response[0];
        
        response.ShouldNotBeNull();
        quartileData.ShouldNotBeNull();
        quartileData.Year.ShouldBe((short) 2025);
        quartileData.DatePeriod.From.ToShortDateString().ShouldBe("1/1/2025");
        quartileData.DatePeriod.To.ToShortDateString().ShouldBe("12/31/2025");
        quartileData.IndicatorId.ShouldBe(indicatorId);
        quartileData.Q0Value.ShouldBe(3.07953);
    }
}
