namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public interface IDataManagementService
{
    Task<bool> UploadFileAsync(Stream fileStream, int indicatorId);
}