namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public interface IDataManagementService
{
    public string SayHelloToRepository();
    Task<bool> UploadFileAsync(Stream fileStream, string fileName, string containerName);
}