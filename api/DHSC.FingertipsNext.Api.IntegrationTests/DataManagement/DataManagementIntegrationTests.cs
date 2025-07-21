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
    private const int IndicatorId = 41101;
    private const string AdminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
    private const string Indicator41101GroupRoleId = "90ac52f4-8513-4050-873a-24340bc89bd3";
    private const string Indicator383GroupRoleId = "3b25520b-4cd5-4f45-8718-a0c8bcbcbf26";
    private const string IntegrationTestFileName = "integration-test.csv";
    private readonly AzureStorageBlobClient _azureStorageBlobClient;
    private readonly string _blobName;
    private readonly DataManagementWebApplicationFactory<Program> _factory;
    private readonly SqlConnection _sqlConnection;

    public DataManagementIntegrationTests(DataManagementWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        _factory.AdminRoleGuid = AdminRoleGuid;

        using var scope = _factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DataManagementDbContext>();
        var healthDataDbContext = scope.ServiceProvider.GetRequiredService<HealthDataDbContext>();
        var connectionString = dbContext.Database.GetDbConnection().ConnectionString;
        _sqlConnection = new SqlConnection(connectionString);

        InitialiseDb(_sqlConnection);

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


    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    [InlineData(Indicator41101GroupRoleId, Indicator383GroupRoleId)]
    public async Task AuthorisedRequestToDataManagementEndpointShouldUploadAFile(params string[] userRoleIds)
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        var publishedAt = DateTime.UtcNow.AddMonths(1);

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken(userRoleIds));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.EnsureSuccessStatusCode();

        var model = await response.Content.ReadFromJsonAsync<Batch>();
        model.IndicatorId.ShouldBe(IndicatorId);
        model.Status.ShouldBe(BatchStatus.Received);
        model.OriginalFileName.ShouldBe(IntegrationTestFileName);
        model.UserId.ShouldBe(Guid.Empty.ToString());
        model.PublishedAt.ShouldBe(publishedAt);

        var blobContent = await _azureStorageBlobClient.DownloadBlob(_blobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }


    [Fact]
    public async Task UnauthorisedRequestToDataManagementEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        using var content = new MultipartFormDataContent();

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        //Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task ExpiredRequestToDataManagementEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([Indicator41101GroupRoleId], true));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        //Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task InvalidRoleForIndicatorShouldBeRejected()
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([Indicator41101GroupRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri("/indicators/9999/data", UriKind.Relative), content);

        //Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task UploadFailuresShouldReturn500Response(string userRoleId)
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        var publishedAt = DateTime.UtcNow.AddMonths(1);

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        // Act
        await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task UploadingInvalidFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        var publishedAt = DateTime.UtcNow.AddMonths(1);

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "invalid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task UploadingEmptyFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(Stream.Null);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", IntegrationTestFileName);

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task UploadingNoFileShouldReturn400Response(string userRoleId)
    {
        // Arrange
        var apiClient = _factory.CreateClient();

        using var content = new MultipartFormDataContent();

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
    }

    [Theory]
    [InlineData(AdminRoleGuid)]
    [InlineData(Indicator41101GroupRoleId)]
    public async Task UploadToBlobStorageShouldFailIfContainerDoesNotExist(string userRoleId)
    {
        // Arrange
        var apiClient = _factory.WithWebHostBuilder(config => config.UseSetting("UPLOAD_STORAGE_CONTAINER_NAME", "invalid-container-name")).CreateClient();

        var publishedAt = DateTime.UtcNow.AddMonths(1);

        using var content = new MultipartFormDataContent();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        var fileStream = File.OpenRead(blobContentFilePath);

        using var streamContent = new StreamContent(fileStream);
        using var publishedAtContent = new StringContent(publishedAt.ToString("o"));

        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");

        content.Add(streamContent, "file", IntegrationTestFileName);
        content.Add(publishedAtContent, "publishedAt");

        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer", _factory.GenerateTestToken([userRoleId]));

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
                PublishedAt = new DateTime(2125, 10, 9, 0, 0, 0, 0)
            },
            batch with
            {
                BatchId = "54321_2017-06-30T14:22:37.123",
                IndicatorId = 54321,
                PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0, 0)
            },
            batch with
            {
                BatchId = "54321_2025-06-30T14:22:37.123",
                IndicatorId = 54321,
                PublishedAt = new DateTime(2030, 1, 1, 0, 0, 0, 0),
                DeletedAt = new DateTime(2025, 7, 1, 0, 0, 0, 0),
                CreatedAt = new DateTime(2025, 6, 30),
                Status = BatchStatus.Deleted
            }
        ];

        var apiClient = _factory.CreateClient();

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

    [Fact]
    public async Task DeleteBatchShouldReturn400ResponseWhenBatchIsAlreadyDeleted()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);
        var batchId = "54321_2025-06-30T14:22:37.123";

        // Act
        var response = await apiClient.DeleteAsync(new Uri($"/batches/{batchId}", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.BadRequest);
        var error = await response.Content.ReadFromJsonAsync<SimpleError>();
        error.Message.ShouldBe("Batch already deleted");
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