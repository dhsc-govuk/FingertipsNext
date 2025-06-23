using Azure;
using Azure.Storage.Blobs;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public class DataManagementService(IDataManagementRepository dataManagementRepository, BlobServiceClient blobServiceClient) : IDataManagementService
{
    public string SayHelloToRepository()
    {
        var repositorySays = dataManagementRepository.SayHello();
        return "The Repository says: " + repositorySays;
    }

    public async Task<bool> UploadFileAsync(Stream fileStream, string fileName, string containerName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName);

        try
        {
            await blobClient.UploadAsync(fileStream);
        }
        catch (Exception ex) when (ex.GetType() == typeof(RequestFailedException) ||
                                   ex.GetType() == typeof(AggregateException))
        {
            return false;
        }

        return true;
    }
}