namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public interface IDataUploadService
{ 
    Task<ServiceResponse<bool>> UploadWithSdkAsync(Stream fileStream, string fileName, string containerName);
    Task<ServiceResponse<bool>> UploadWithRestAsync(Stream fileStream, string storageAccountName, string containerName, string fileName, string storageAccountKey);
}