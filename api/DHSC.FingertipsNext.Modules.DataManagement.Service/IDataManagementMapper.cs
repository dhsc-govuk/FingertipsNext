using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service;

public interface IDataManagementMapper
{
    Batch Map(BatchModel source);
}