using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.TestData;

internal static class BatchExamples
{
    public static readonly Batch Batch = new()
    {
        BatchId = "41101_2020-03-07T14:22:37.123Z",
        IndicatorId = 41101,
        Status = BatchStatus.Received,
        OriginalFileName = "upload.csv",
        UserId = Guid.Empty.ToString(),
        CreatedAt = new DateTime(2017, 6, 30, 18, 49, 37),
        PublishedAt = new DateTime(2020, 3, 7, 0, 0, 0)
    };
}