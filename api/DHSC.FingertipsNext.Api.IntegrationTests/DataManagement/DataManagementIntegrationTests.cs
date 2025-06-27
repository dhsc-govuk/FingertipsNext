using DotNetEnv;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.Configuration;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class DataManagementIntegrationTests : IClassFixture<WebApplicationFactory<Program>>, IDisposable
{
    private const string TestDataDir = "TestData";
    private const string BlobName = "blobName";
    private readonly AzureStorageBlobClient _azureStorageBlobClient;

    private readonly WebApplicationFactory<Program> _appFactory;

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

        _appFactory = factory.WithWebHostBuilder(builder =>
        {
            builder.ConfigureAppConfiguration((context, configBuilder) =>
            {
                Env.Load(string.Empty, new LoadOptions(true, true, false));

                configBuilder.AddConfiguration(configuration);
            });

        });


        _azureStorageBlobClient = new AzureStorageBlobClient(configuration);
    }

    public void Dispose()
    {
        _azureStorageBlobClient.DeleteBlob(BlobName);
        _appFactory?.Dispose();
    }

    [Fact]
    public async Task DataManagementEndpointShouldUploadAFile()
    {
        // Arrange
        var blobContentFilePath = Path.Combine(TestDataDir, "blobContent.json");

        // Temporarily upload the file ourselves, until the API is uploading files to Azure storage.
        await _azureStorageBlobClient.UploadBlob(BlobName, blobContentFilePath);

        var client = _appFactory.CreateClient();

        // Act
        var response = await client.GetAsync(new Uri("/data_management", UriKind.Relative));

        // Assert
        response.EnsureSuccessStatusCode();

        var blobContent = await _azureStorageBlobClient.DownloadBlob(BlobName);
        var localFileContent = await File.ReadAllBytesAsync(blobContentFilePath);
        blobContent.ShouldBeEquivalentTo(localFileContent);
    }
}