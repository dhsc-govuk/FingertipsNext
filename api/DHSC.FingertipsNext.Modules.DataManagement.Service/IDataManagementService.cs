using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public interface IDataManagementService
{
    Task<UploadHealthDataResponse> UploadFileAsync(Stream fileStream, int indicatorId, string userId, DateTime publishedAt, string originalFileName);

    ICollection<string> ValidateCsv(Stream fileStream);
    Task<IEnumerable<Batch>> ListBatches(int[] indicatorIds);
    Task<UploadHealthDataResponse> DeleteBatchAsync(string batchId, string userId, IList<int> indicatorsThatCanBeModified);
}