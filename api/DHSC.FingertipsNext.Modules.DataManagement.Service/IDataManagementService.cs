using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public interface IDataManagementService
{
    Task<UploadHealthDataResponse> UploadFileAsync(Stream fileStream, int indicatorId, DateTime publishedAt);
    ICollection<string> ValidateCsv(Stream fileStream);
}