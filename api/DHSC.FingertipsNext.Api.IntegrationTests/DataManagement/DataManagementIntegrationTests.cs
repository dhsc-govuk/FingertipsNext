using System.Net;
using System.Net.Http.Headers;
using DotNetEnv;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class DataManagementIntegrationTests : IClassFixture<CustomWebApplicationFactory<Program>>, IDisposable
{
    private CustomWebApplicationFactory<Program> _factory;
    private const string TestDataDir = "TestData";
    private readonly string _blobName;
    private const int IndicatorId = 9000;
    private const string FingertipsStorageContainerName = "fingertips-upload-container";
    private readonly AzureStorageBlobClient _azureStorageBlobClient;

    public DataManagementIntegrationTests(CustomWebApplicationFactory<Program> factory)
    {
        _factory = factory;
        
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
        _factory.Dispose();
    }
    
    private static HttpClient GetApiClient(CustomWebApplicationFactory<Program> factory, string blobContainerName = FingertipsStorageContainerName)
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

        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", "blobContent.json");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.EnsureSuccessStatusCode();

        var blobContent = await _azureStorageBlobClient.DownloadBlob(_blobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }

    [Fact]
    public async Task UploadFailuresShouldReturn500Response()
    {
        // Arrange
        var apiClient = GetApiClient(_factory);

        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", "blobContent.json");

        // Act
        await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
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

        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");
        await using var fileStream = File.OpenRead(blobContentFilePath);
        using var content = new MultipartFormDataContent();
        using var streamContent = new StreamContent(fileStream);
        streamContent.Headers.ContentType = new MediaTypeHeaderValue("application/octet-stream");
        content.Add(streamContent, "file", "blobContent.json");

        // Act
        var response = await apiClient.PostAsync(new Uri($"/indicators/{IndicatorId}/data", UriKind.Relative), content);

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.InternalServerError);
    }
}