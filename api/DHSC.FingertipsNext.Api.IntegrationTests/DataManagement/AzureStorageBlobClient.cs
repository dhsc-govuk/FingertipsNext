using Azure.Storage;
using Azure.Storage.Blobs;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

internal sealed class AzureStorageBlobClient
{
    private readonly BlobContainerClient _blobContainerClient;

    public AzureStorageBlobClient(IConfiguration configuration)
    {
        var storageUri = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_URI");
        ArgumentNullException.ThrowIfNull(storageUri);

        var storageAccountName = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_NAME");
        ArgumentNullException.ThrowIfNull(storageAccountName);
        var storageAccountKey = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_KEY");
        ArgumentNullException.ThrowIfNull(storageAccountKey);

        var containerName = configuration.GetValue<string>("UPLOAD_STORAGE_CONTAINER_NAME");
        ArgumentNullException.ThrowIfNull(containerName);

        var blobServiceClient = new BlobServiceClient(new Uri(storageUri),
            new StorageSharedKeyCredential(storageAccountName, storageAccountKey));
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