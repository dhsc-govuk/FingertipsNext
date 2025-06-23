using Azure.Storage.Blobs;
using DotNetEnv;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public class DataManagementIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private const string TestDataDir = "TestData";
    private const string BlobName = "blobName";
    private readonly HttpClient _apiClient;
    private readonly BlobContainerClient _blobContainerClient;

    public DataManagementIntegrationTests(WebApplicationFactory<Program> factory)
    {
        // support for .env file
        Env.Load(string.Empty, new LoadOptions(true, true, false));

        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .AddEnvironmentVariables()
            .Build();

        ArgumentNullException.ThrowIfNull(factory);
        _apiClient = factory.CreateClient();

        var connectionString = configuration.GetConnectionString("UploadStorageAccount");
        ArgumentNullException.ThrowIfNull(connectionString);

        var containerName = configuration.GetValue<string>("UPLOAD_STORAGE_CONTAINER_NAME");
        ArgumentNullException.ThrowIfNull(containerName);

        var blobServiceClient = new BlobServiceClient(connectionString);
        _blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        _blobContainerClient.DeleteBlobIfExists(BlobName);
        _apiClient.Dispose();
    }

    [Fact]
    public async Task DataManagementEndpointShouldUploadAFile()
    {
        // Arrange
        var blobClient = _blobContainerClient.GetBlobClient(BlobName);
        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");

        // Temporarily upload the file ourselves, until the API is uploading files to Azure storage.
        await blobClient.UploadAsync(blobContentFilePath);

        // Act
        var response = await _apiClient.GetAsync(new Uri("/data_management"));

        // Assert
        response.EnsureSuccessStatusCode();

        var blobResponse = await blobClient.DownloadContentAsync();
        var blobContent = blobResponse.Value.Content.ToArray();
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }
}