using System.Net;
using System.Text.Json;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DotNetEnv;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.HealthData;

public sealed class HealthDataIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private readonly WebApplicationFactory<Program> _factory;
    private SqlConnection _sqlConnection;
    private static int IndicatorId = 41101;
    private static string UnpublishedBatch = "unpublishedBatch1";
    private static string PublishedBatch = "publishedBatch1";

    public HealthDataIntegrationTests(WebApplicationFactory<Program> factory)
    {
        Env.Load(string.Empty, new LoadOptions(true, true, false));

        _factory = factory;

        using var scope = _factory.Services.CreateScope();
        var healthDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var connectionString = healthDbContext.Database.GetDbConnection().ConnectionString;
        _sqlConnection = new SqlConnection(connectionString);

        InitialiseDb(_sqlConnection);
    }

    [Fact]
    public async Task DeleteUnpublishedDataEndpointShouldDeleteBatchData()
    {
        // Arrange
        var client = _factory.CreateClient();

        await AssertExpectedHealthDataCount(client, 3);

        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId}/data/{UnpublishedBatch}", UriKind.Relative));

        // Assert
        response.EnsureSuccessStatusCode();
        await AssertExpectedHealthDataCount(client, 1);
    }

    [Fact]
    public async Task DeleteUnpublishedEndpointShouldRespondWith400WhenAttemptingToDeletePublishedBatch()
    {
        // Arrange
        var client = _factory.CreateClient();

        await AssertExpectedHealthDataCount(client, 3);

        // Act
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId}/data/{PublishedBatch}", UriKind.Relative));

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
        var response = await client.DeleteAsync(new Uri($"/indicators/{IndicatorId}/data/{nonExistentBatch}", UriKind.Relative));

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
        var response = await client.DeleteAsync(new Uri($"/indicators/{nonExistentIndicatorId}/data/{UnpublishedBatch}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.NotFound);
        await AssertExpectedHealthDataCount(client, 3);
    }

    private static async Task AssertExpectedHealthDataCount(HttpClient client, int count)
    {
        var availableHealthDataResponse = await client.GetAsync(new Uri($"/indicators/{IndicatorId}/data/all?area_codes=E12000002", UriKind.Relative));
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

    private static void InitialiseDb(SqlConnection sqlConnection)
    {
        sqlConnection.Open();
        var setupPath = Path.Combine(AppContext.BaseDirectory, "setup.sql");
        RunSqlScript(setupPath, sqlConnection);
    }

    private static void RunSqlScript(string path, SqlConnection connection)
    {
        var sql = File.ReadAllText(path);
        using var sqlCommand = new SqlCommand(sql, connection);
        sqlCommand.ExecuteNonQuery();
    }

    public void Dispose()
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, "cleanup.sql");
        RunSqlScript(cleanupPath, _sqlConnection);
        _sqlConnection.Close();
        _sqlConnection.Dispose();
    }
}