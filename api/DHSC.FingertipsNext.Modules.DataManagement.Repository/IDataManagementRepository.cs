using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public interface IDataManagementRepository
{
    Task<BatchModel> AddBatchAsync(BatchModel batch);
    Task<IEnumerable<BatchModel>> GetAllBatchesAsync();
    Task<IEnumerable<BatchModel>> GetBatchesByIdsAsync(int[] indicators);
    Task<BatchModel?> DeleteBatchAsync(string batchId, string userId, IList<int> indicatorsThatCanBeModified);
}