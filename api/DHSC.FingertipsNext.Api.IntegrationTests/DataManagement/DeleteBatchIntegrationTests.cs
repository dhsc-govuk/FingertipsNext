using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class DeleteBatchIntegrationTests : DataManagementIntegrationTests
{
    public DeleteBatchIntegrationTests(WebApplicationFactoryWithAuth<Program> factory) : base(factory)
    {
        InitialiseDb(Connection, "delete-batch-setup.sql");
    }

    protected override void Dispose(bool disposing)
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, "delete-batch-cleanup.sql");
        RunSqlScript(cleanupPath, Connection);

        base.Dispose(disposing);
    }

    [Fact]
    public async Task DeleteBatchEndpointShouldReturn200Response()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        var batchId = "12345_2017-06-30T14:22:37.123";
        using var scope = Factory.Services.CreateScope();
        var healthDataDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var healthDataBeforeDelete =
            await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
        healthDataBeforeDelete.ShouldBe(1);
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken());

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var batch = await response.Content.ReadFromJsonAsync(typeof(Batch)) as Batch;
        batch.BatchId.ShouldBe(batchId);
        batch.DeletedAt.ShouldNotBeNull();
        batch.Status.ShouldBe(BatchStatus.Deleted);
        batch.IndicatorId.ShouldBe(12345);

        // Ensure health data is deleted
        var healthDataAfterDelete =
            await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
        healthDataAfterDelete.ShouldBe(0);
    }

    [Fact]
    public async Task DeleteBatchEndpointShouldReturn404ResponseWhenBatchDoesNotExist()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        const string batchId = "1234";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken());

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        var error = await response.Content.ReadAsStringAsync();
        error.ShouldContain("Not found");
    }

    [Fact]
    public async Task DeleteBatchShouldReturn400ResponseWhenBatchIsPublished()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        const string batchId = "54321_2017-06-30T14:22:37.123";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken());

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already published");
    }

    [Fact]
    public async Task DeleteBatchShouldReturn400ResponseWhenBatchIsAlreadyDeleted()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        const string batchId = "54321_2025-06-30T14:22:37.123";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken());

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already deleted");
    }
}