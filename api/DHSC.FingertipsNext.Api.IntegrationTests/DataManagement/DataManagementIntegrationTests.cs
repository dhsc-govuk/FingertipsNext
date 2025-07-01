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
    private readonly AzureStorageBlobClient _azureStorageBlobClient;

    public DataManagementIntegrationTests(WebApplicationFactory<Program> factory)
    {
        // Load environment variables from the .env file
        Env.Load(string.Empty, new LoadOptions(true, true, false));

        // Load configuration from the test JSON file.
        var configuration = new ConfigurationBuilder()
            .AddJsonFile("appsettings.test.json")
            .AddEnvironmentVariables()
            .Build();

        ArgumentNullException.ThrowIfNull(factory);
        _apiClient = factory.CreateClient();

        _azureStorageBlobClient = new AzureStorageBlobClient(configuration);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        _azureStorageBlobClient.DeleteBlob(BlobName);
        _apiClient.Dispose();
    }

    [Fact]
    public async Task DataManagementEndpointShouldUploadAFile()
    {
        // Arrange
        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");

        // Temporarily upload the file ourselves, until the API is uploading files to Azure storage.
        await _azureStorageBlobClient.UploadBlob(BlobName, blobContentFilePath);

        // Act
        var response = await _apiClient.GetAsync(new Uri("http://localhost:5144/data_management"));

        // Assert
        response.EnsureSuccessStatusCode();

        var blobContent = await _azureStorageBlobClient.DownloadBlob(BlobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }
}