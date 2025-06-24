using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService(BlobServiceClient blobServiceClient) : IDataManagementService
{
    public async Task<bool> UploadFileAsync(Stream fileStream, string fileName, string containerName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        try
        {
            await blobClient.UploadAsync(fileStream, true);
        }
        catch (Exception exception) when (exception is RequestFailedException or AggregateException)
        {
            return false;
        }

        return true;
    }
}