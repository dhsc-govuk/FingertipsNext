using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class FileUploadIntegrationTests : DataManagementIntegrationTests
{
    // Uses a different indicator ID, to avoid conflicting
    // with the "list batches" integration tests when run in parallel.
    private const int IndicatorId = 41203;
    private const string TestDataDir = "TestData";
    private const string CsvFilename = "file-upload-integration-test.csv";

    private readonly AzureStorageBlobClient _azureStorageBlobClient;
    private readonly string _blobName;

    public FileUploadIntegrationTests(DataManagementWebApplicationFactory<Program> factory) : base(factory)
    {
        // Load configuration from the test JSON file.
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .AddEnvironmentVariables()
            .Build();

        _blobName = $"{IndicatorId}_{MockTime:yyyy-MM-ddTHH:mm:ss.fff}.csv";
        _azureStorageBlobClient = new AzureStorageBlobClient(configuration);
    }

    protected override void Dispose(bool disposing)
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, "file-upload-cleanup.sql");
        RunSqlScript(cleanupPath, Connection);

        _azureStorageBlobClient.DeleteBlob(_blobName);

        base.Dispose(disposing);
    }

    [Fact]
    public async Task DataManagementEndpointShouldUploadAFile()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        publishedAtContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(streamContent, "file", CsvFilename);
        content.Add(publishedAtContent, "publishedAt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.EnsureSuccessStatusCode();

        var model = await response.Content.ReadFromJsonAsync<Batch>();
        model.IndicatorId.ShouldBe(IndicatorId);
        model.Status.ShouldBe(BatchStatus.Received);
        model.OriginalFileName.ShouldBe(CsvFilename);
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
        var apiClient = Factory.CreateClient();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        content.Add(streamContent, "file", CsvFilename);
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
        var apiClient = Factory.CreateClient();

        var blobContentFilePath = Path.Combine(TestDataDir, "invalid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        publishedAtContent.Headers.ContentType = new MediaTypeHeaderValue("text/plain");
        content.Add(streamContent, "file", CsvFilename);
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
        var apiClient = Factory.CreateClient();

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
        var apiClient = Factory.CreateClient();

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
        var apiClient = Factory.WithWebHostBuilder(config => config.UseSetting("UPLOAD_STORAGE_CONTAINER_NAME", "invalid-container-name")).CreateClient();

        var blobContentFilePath = Path.Combine(TestDataDir, "valid.csv");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        var publishedAt = DateTime.UtcNow.AddMonths(1);
        var publishedAtFormatted = publishedAt.ToString("o");
        using var publishedAtContent = new StringContent(publishedAtFormatted);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", CsvFilename);
        content.Add(publishedAtContent, "publishedAt");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }
}