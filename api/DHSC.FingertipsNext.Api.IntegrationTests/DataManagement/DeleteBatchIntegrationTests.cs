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
    // Uses a different indicator from other tests, to avoid conflicting
    // when run in parallel.
    private const int IndicatorId = 92266;
    private const string Indicator92266GroupRoleId = "e3cba68a-0640-4642-bc90-625928a9dce1";

    public DeleteBatchIntegrationTests(DataManagementWebApplicationFactory<Program> factory) : base(factory)
    {
        InitialiseDb(Connection, "delete-batch-setup.sql");
    }

    protected override void Dispose(bool disposing)
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, "delete-batch-cleanup.sql");
        RunSqlScript(cleanupPath, Connection);

        base.Dispose(disposing);
    }

    [Theory]
    [InlineData("92266_2017-06-30T14:22:37.123", AdminRoleGuid)]
    [InlineData("92266_2017-07-01T14:22:37.123", Indicator92266GroupRoleId)]
    [InlineData("92266_2017-07-02T14:22:37.123", Indicator92266GroupRoleId, Indicator383GroupRoleId)]
    public async Task DeleteBatchEndpointShouldReturn200Response(string batchId, params string[] userRoleIds)
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        using var scope = Factory.Services.CreateScope();
        var healthDataDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var healthDataBeforeDelete =
            await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
        healthDataBeforeDelete.ShouldBe(1);
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken(userRoleIds));

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.OK);
        var batch = await response.Content.ReadFromJsonAsync(typeof(Batch)) as Batch;
        batch.BatchId.ShouldBe(batchId);
        batch.DeletedAt.ShouldNotBeNull();
        batch.Status.ShouldBe(BatchStatus.Deleted);
        batch.IndicatorId.ShouldBe(IndicatorId);

        // Ensure health data is deleted
        var healthDataAfterDelete =
            await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
        healthDataAfterDelete.ShouldBe(0);
    }

    [Fact]
    public async Task UnauthorisedRequestToDeleteBatchEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        // Act
        var response = await apiClient.DeleteAsync(new Uri("/batches/1234", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task ExpiredRequestToDeleteBatchEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator92266GroupRoleId], true));

        // Act
        var response = await apiClient.DeleteAsync(new Uri("/batches/1234", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task InvalidRoleForBatchShouldBeRejectedByDeleteBatchEndpoint()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        const string batchId = "92266_2017-07-03T14:22:37.123";

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator383GroupRoleId]));

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }


    [Fact]
    public async Task DeleteBatchEndpointShouldReturn404ResponseWhenBatchDoesNotExist()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        const string batchId = "1234";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([AdminRoleGuid]));

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
        const string batchId = "92266_2017-07-04T14:22:37.123";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator92266GroupRoleId]));

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
        const string batchId = "92266_2017-07-05T14:22:37.123";
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator92266GroupRoleId]));

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already deleted");
    }
}