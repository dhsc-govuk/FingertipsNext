using System.Net;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public abstract class DataManagementIntegrationTests : IClassFixture<DataManagementWebApplicationFactory<Program>>, IDisposable
{
    protected const string AdminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
    protected const string Indicator383GroupRoleId = "3b25520b-4cd5-4f45-8718-a0c8bcbcbf26";
    protected const string SqlScriptDirectory = "DataManagement";

    protected DataManagementIntegrationTests(DataManagementWebApplicationFactory<Program> factory)
    {
        Factory = factory;
        Factory.AdminRoleGuid = AdminRoleGuid;

        using var scope = Factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DataManagementDbContext>();
        var connectionString = dbContext.Database.GetDbConnection().ConnectionString;
        Connection = new SqlConnection(connectionString);
        Connection.Open();

        ArgumentNullException.ThrowIfNull(factory);
        MockTime = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        Factory.MockTime.SetUtcNow(MockTime);
    }

    protected SqlConnection Connection { get; }

    protected DateTime MockTime { get; }

    protected DataManagementWebApplicationFactory<Program> Factory { get; }


    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
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
        var batchId = "1234";

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
        var batchId = "54321_2017-06-30T14:22:37.123";

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
        var batchId = "54321_2025-06-30T14:22:37.123";

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already deleted");
    }
    
    protected virtual void Dispose(bool disposing)
    {
        if (!disposing) return;

        Connection.Close();
    }

    protected static void InitialiseDb(SqlConnection sqlConnection, string filename)
    {
        ArgumentNullException.ThrowIfNull(sqlConnection);

        var setupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, filename);
        RunSqlScript(setupPath, sqlConnection);
    }

    protected static void RunSqlScript(string path, SqlConnection? connection)
    {
        var sql = File.ReadAllText(path);
        using var sqlCommand = new SqlCommand(sql, connection);
        sqlCommand.ExecuteNonQuery();
    }
}