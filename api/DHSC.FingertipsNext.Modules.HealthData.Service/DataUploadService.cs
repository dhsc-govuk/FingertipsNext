using Azure;
using Azure.Storage.Blobs;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class DataUploadService(BlobServiceClient blobServiceClient) : IDataUploadService
{
    public async Task<ServiceResponse<bool>> UploadWithSdkAsync(Stream fileStream, string fileName, string containerName)
    {
        var containerClient = blobServiceClient.GetBlobContainerClient(containerName);
        var blobClient = containerClient.GetBlobClient(fileName).WithVersion("2022-11-02");

        try
        {
            await blobClient.UploadAsync(fileStream, true);
        }
        catch (RequestFailedException exception)
        {
            Console.WriteLine("error is here " + exception.Message);
            return new ServiceResponse<bool> { Status = ResponseStatus.Unknown, Content = false };
        }
        
        return new  ServiceResponse<bool> { Status = ResponseStatus.Success, Content = true };
    }

    public Task UploadWithRestAsync(Stream fileStream)
    {
        throw new NotImplementedException();
    }
}