using System.Collections.ObjectModel;
using System.Text.Json;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.HealthData;

public class HealthDataIntegrationTests : IClassFixture<HealthDataWebApplicationFactory<Program>>
{
    private readonly HealthDataWebApplicationFactory<Program> _factory;

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
        var response = await client.DeleteAsync(new Uri($"/indicators/1/batch/batchId1", UriKind.Relative));
        response.EnsureSuccessStatusCode();

        // Assert
        await AssertExpectedHealthDataCount(client, 1);
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
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();
        var unPublishedHealthMeasure2 = new HealthMeasureModelHelper(key: 101, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();
        var publishedHealthMeasureForIndicatorId1 = new HealthMeasureModelHelper(key: 102, isPublished: true)
            .WithBatchId("publishedBatch1")
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("a1", "area1")
            .Build();
        var unPublishedHealthMeasureForIndicatorId2 = new HealthMeasureModelHelper(key: 103, isPublished: true)
            .WithBatchId("batchId2")
            .WithIndicatorDimension(indicatorId: 2)
            .WithAreaDimension("a1", "area1")
            .Build();
        var healthMeasure4 = new HealthMeasureModelHelper(key: 104, isPublished: true)
            .WithBatchId("batchId2")
            .WithIndicatorDimension(indicatorId: 2)
            .WithAreaDimension("a1", "area1")
            .Build();

        return new Collection<HealthMeasureModel>
        {
            unPublishedHealthMeasure1,
            unPublishedHealthMeasure2,
            publishedHealthMeasureForIndicatorId1,
            unPublishedHealthMeasureForIndicatorId2,
            healthMeasure4
        };
    }
}