using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DotNetEnv;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class DataManagementIntegrationTests : IClassFixture<DataManagementWebApplicationFactory<Program>>,
    IDisposable
{
    private const string TestDataDir = "TestData";
    private const int IndicatorId = 9000;
    private const string FingertipsStorageContainerName = "fingertips-upload-container";
    private readonly AzureStorageBlobClient _azureStorageBlobClient;
    private readonly string _blobName;
    private readonly DataManagementWebApplicationFactory<Program> _factory;
    private readonly SqlConnection _sqlConnection;

    public DataManagementIntegrationTests(DataManagementWebApplicationFactory<Program> factory)
    {
        _factory = factory;

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DataManagementDbContext>();
        var healthDataDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var connectionString = dbContext.Database.GetDbConnection().ConnectionString;
        _sqlConnection = new SqlConnection(connectionString);

        InitialiseDb(_sqlConnection);

        // Load environment variables from the .env file
        Env.Load(string.Empty, new LoadOptions(true, true, false));

        // Load configuration from the test JSON file.
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .AddEnvironmentVariables()
            .Build();

        ArgumentNullException.ThrowIfNull(factory);
        var mockTime = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        _blobName = $"{IndicatorId}_{mockTime:yyyy-MM-ddTHH:mm:ss.fff}.csv";
        _factory.MockTime.SetUtcNow(mockTime);
        _azureStorageBlobClient = new AzureStorageBlobClient(configuration);
    }

    public void Dispose()
    {
        _azureStorageBlobClient.DeleteBlob(_blobName);

        var cleanupPath = Path.Combine(AppContext.BaseDirectory, "DataManagement/cleanup.sql");
        RunSqlScript(cleanupPath, _sqlConnection);
        _sqlConnection.Close();
    }

    private static HttpClient GetApiClient(DataManagementWebApplicationFactory<Program> factory,
        string blobContainerName = FingertipsStorageContainerName)
    {
        return factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, config) =>
            {
                config.AddInMemoryCollection(new Dictionary<string, string?>
                {
                    ["UPLOAD_STORAGE_CONTAINER_NAME"] = blobContainerName
                });
            });
        }).CreateClient();
    }

    [Fact]
    public async Task DataManagementEndpointShouldUploadAFile()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        publishedAtContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(streamContent, "file", "valid.csv");
        content.Add(publishedAtContent, "publishedAt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.EnsureSuccessStatusCode();

        var model = await response.Content.ReadFromJsonAsync<Batch>();
        model.IndicatorId.ShouldBe(IndicatorId);
        model.Status.ShouldBe(BatchStatus.Received);
        model.OriginalFileName.ShouldBe("valid.csv");
        model.UserId.ShouldBe(Guid.Empty.ToString());
        model.PublishedAt.ShouldBe(publishedAt);

        var blobContent = await _azureStorageBlobClient.DownloadBlob(_blobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }

    [Fact]
    public async Task UploadFailuresShouldReturn500Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        content.Add(streamContent, "file", "valid.csv");
        content.Add(publishedAtContent, "publishedAt");

        // Act
        await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task UploadingInvalidFileShouldReturn400Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        var blobContentFilePath = Path.Combine(TestDataDir, "invalid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        publishedAtContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(streamContent, "file", "valid.csv");
        content.Add(publishedAtContent, "publishedAt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UploadingEmptyFileShouldReturn400Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(Stream.Null);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", "fakeFile.txt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UploadingNoFileShouldReturn400Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        using var content = new MultipartFormDataContent();

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Fact]
    public async Task UploadToBlobStorageShouldFailIfContainerDoesNotExist()
    {
        // Arrange
        var apiClient = GetApiClient(_factory, "non-existent-container");

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", "valid.csv");
        content.Add(publishedAtContent, "publishedAt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }

    [Fact]
    public async Task ListBatchesEndpointShouldListAllBatches()
    {
        // Arrange
        var batch = new Batch
        {
            BatchId = "41101_2020-03-07T14:22:37.123",
            IndicatorId = 41101,
            Status = BatchStatus.Received,
            OriginalFileName = "integration-test.csv",
            UserId = "4fbbbb61-ed6d-4777-943c-7d597f90445a",
            CreatedAt = new DateTime(2017, 6, 30, 18, 49, 37),
            PublishedAt = new DateTime(2025, 8, 9, 0, 0, 0, 0)
        };
        Batch[] expectedResult =
        [
            batch,
            batch with
            {
                BatchId = "383_2017-06-30T14:22:37.123",
                IndicatorId = 383,
                Status = BatchStatus.Deleted,
                PublishedAt = new DateTime(2025, 9, 9, 0, 0, 0, 0)
            },
            batch with
            {
                BatchId = "22401_2017-06-30T14:22:37.123",
                IndicatorId = 22401,
                PublishedAt = new DateTime(2025, 10, 9, 0, 0, 0, 0)
            },
            batch with
            {
                BatchId = "12345_2017-06-30T14:22:37.123",
                IndicatorId = 12345,
                PublishedAt = new DateTime(2025, 10, 9, 0, 0, 0, 0)
            },
            batch with
            {
                BatchId = "54321_2017-06-30T14:22:37.123",
                IndicatorId = 54321,
                PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0, 0)
            }
        ];

        var apiClient = GetApiClient(_factory);

        // Act
        var response = await apiClient.GetFromJsonAsync<Batch[]>(new Uri("/batches", UriKind.Relative));

        // Assert
        response.ShouldBeEquivalentTo(expectedResult);
    }

    [Fact]
    public async Task DeleteBatchEndpointShouldReturn200Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);
        var batchId = "12345_2017-06-30T14:22:37.123";
        using var scope = _factory.Services.CreateScope();
        var healthDataDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var healthDataBeforeDelete = await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
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
        var healthDataAfterDelete = await healthDataDbContext.HealthMeasure.Where(hm => hm.BatchId == batchId).CountAsync();
        healthDataAfterDelete.ShouldBe(0);
    }

    [Fact]
    public async Task DeleteBatchEndpointShouldReturn404ResponseWhenBatchDoesNotExist()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);
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
        var apiClient = GetApiClient(_factory);
        var batchId = "54321_2017-06-30T14:22:37.123";

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already published");
    }

    private static void InitialiseDb(SqlConnection sqlConnection)
    {
        sqlConnection.Open();
        var setupPath = Path.Combine(AppContext.BaseDirectory, "DataManagement/setup.sql");
        RunSqlScript(setupPath, sqlConnection);
    }

    private static void RunSqlScript(string path, SqlConnection connection)
    {
        var sql = File.ReadAllText(path);
        using var sqlCommand = new SqlCommand(sql, connection);
        sqlCommand.ExecuteNonQuery();
    }
}