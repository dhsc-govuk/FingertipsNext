using System.Collections.ObjectModel;
using System.Net;
using System.Text.Json;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.HealthData;

public class HealthDataIntegrationTests : IClassFixture<HealthDataWebApplicationFactory<Program>>
{
    private readonly HealthDataWebApplicationFactory<Program> _factory;
    private static int IndicatorId1 = 1;
    private static string UnpublishedBatch1 = "unpublishedBatch1";

    public HealthDataIntegrationTests(HealthDataWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        using var scope = _factory.Services.CreateScope();
        var healthDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();

        ReInitialiseDb(healthDbContext);
    }

    [Fact]
    public async Task DeleteUnpublishedDataEndpointShouldDeleteBatchData()
    {
        // Arrange
        var client = _factory.CreateClient();

        await AssertExpectedHealthDataCount(client, 3);

        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId1}/batch/{UnpublishedBatch1}", UriKind.Relative));

        // Assert
        response.EnsureSuccessStatusCode();
        await AssertExpectedHealthDataCount(client, 1);
    }

    [Fact]
    public async Task DeleteUnpublishedEndpointShouldRespondWith400WhenAttemptingToDeletePublishedBatch()
    {
        // Arrange
        var publisedBatchId = "publishedBatch1";
        var client = _factory.CreateClient();
        
        await AssertExpectedHealthDataCount(client, 3);
        
        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId1}/batch/{publisedBatchId}", UriKind.Relative));
        
        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        await AssertExpectedHealthDataCount(client, 3);
    }

    [Fact]
    public async Task DeleteUnpublishedEndpointShouldRespondWith404WhenBatchDoesNotExist()
    {
        // Arrange
        var nonExistentBatch = "nonExistentBatch";
        var client = _factory.CreateClient();
        
        await AssertExpectedHealthDataCount(client, 3);
        
        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId1}/batch/{nonExistentBatch}", UriKind.Relative));
        
        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        await AssertExpectedHealthDataCount(client, 3);
    }

    [Fact]
    public async Task DeleteUnpublishedEndpointShouldRespondWith404WhenIndicatorIdDoesNotExist()
    {
        // Arrange
        var nonExistentIndicatorId = 3;
        var client = _factory.CreateClient();
        
        await AssertExpectedHealthDataCount(client, 3);
        
        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{nonExistentIndicatorId}/batch/{UnpublishedBatch1}", UriKind.Relative));
        
        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        await AssertExpectedHealthDataCount(client, 3);
    }

    private static async Task AssertExpectedHealthDataCount(HttpClient client, int count)
    {
        var availableHealthDataResponse = await client.GetAsync(new Uri("/indicators/1/data/all?area_codes=a1&years=2025", UriKind.Relative));
        availableHealthDataResponse.EnsureSuccessStatusCode();

        var indicatorDataBeforeDeletion = await GetSerialisedResponse(availableHealthDataResponse);
        indicatorDataBeforeDeletion.AreaHealthData.First().HealthData.Count().ShouldBe(count);
    }

    private static async Task<IndicatorWithHealthDataForAreas?> GetSerialisedResponse(HttpResponseMessage response)
    {
        var availableDataResponseStream = await response.Content.ReadAsStreamAsync();
        return await JsonSerializer.DeserializeAsync<IndicatorWithHealthDataForAreas>(
                availableDataResponseStream);
    }

    private static void InitialiseDb(HealthDataDbContext db)
    {
        db.Database.EnsureCreated();
        db.HealthMeasure.AddRange(GetHealthMeasureModels());
        db.SaveChanges();
    }

    private static void ReInitialiseDb(HealthDataDbContext db)
    {
        db.Database.EnsureDeleted();
        InitialiseDb(db);
    }

    private static Collection<HealthMeasureModel> GetHealthMeasureModels()
    {
        var unPublishedHealthMeasure1 = new HealthMeasureModelHelper(key: 100, isPublished: false)
            .WithBatchId($"{UnpublishedBatch1}")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();
        var unPublishedHealthMeasure2 = new HealthMeasureModelHelper(key: 101, isPublished: false)
            .WithBatchId($"{UnpublishedBatch1}")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();
        var publishedHealthMeasureForIndicatorId1 = new HealthMeasureModelHelper(key: 102, isPublished: true)
            .WithBatchId("publishedBatch1")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();

        return new Collection<HealthMeasureModel>
        {
            unPublishedHealthMeasure1,
            unPublishedHealthMeasure2,
            publishedHealthMeasureForIndicatorId1,
        };
    }
}