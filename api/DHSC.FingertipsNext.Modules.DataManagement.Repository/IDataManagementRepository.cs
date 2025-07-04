using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public interface IDataManagementRepository
{
    Task<BatchModel> AddBatchAsync(BatchModel batch);
}