using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

internal sealed class AzureStorageBlobClient
{
    private readonly BlobContainerClient _blobContainerClient;
    private readonly IConfiguration _configuration;

    public AzureStorageBlobClient(IConfiguration configuration)
    {
        _configuration = configuration;

        var connectionString = configuration.GetConnectionString("UploadStorageAccount");
        ArgumentNullException.ThrowIfNull(connectionString);

        var containerName = configuration.GetValue<string>("UPLOAD_STORAGE_CONTAINER_NAME");
        ArgumentNullException.ThrowIfNull(containerName);

        var blobServiceClient = new BlobServiceClient(connectionString);
        _blobContainerClient = blobServiceClient.GetBlobContainerClient(containerName);
    }

    public async Task UploadBlob(string blobName, string blobContentFilePath)
    {
        var blobClient = _blobContainerClient.GetBlobClient(blobName);

        await blobClient.UploadAsync(blobContentFilePath);
    }


    public async Task<byte[]> DownloadBlob(string blobName)
    {
        var blobClient = _blobContainerClient.GetBlobClient(blobName);

        var blobResponse = await blobClient.DownloadContentAsync();
        return blobResponse.Value.Content.ToArray();
    }

    public void DeleteBlob(string blobName)
    {
        _blobContainerClient.DeleteBlobIfExists(blobName);
    }
}