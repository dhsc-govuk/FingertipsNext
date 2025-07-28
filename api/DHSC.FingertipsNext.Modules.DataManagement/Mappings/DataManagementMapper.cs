using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;

namespace DHSC.FingertipsNext.Modules.DataManagement.Mappings;

public class DataManagementMapper : IDataManagementMapper
{
    public Batch Map(BatchModel source)
    {
        ArgumentNullException.ThrowIfNull(source);
        return new Batch
        {
            BatchId = source.BatchId,
            IndicatorId = source.IndicatorId,
            OriginalFileName = source.OriginalFileName,
            CreatedAt = source.CreatedAt,
            DeletedAt = source.DeletedAt,
            PublishedAt = source.PublishedAt,
            UserId = source.UserId,
            DeletedUserId = source.DeletedUserId,
            Status = source.Status
        };
    }
}