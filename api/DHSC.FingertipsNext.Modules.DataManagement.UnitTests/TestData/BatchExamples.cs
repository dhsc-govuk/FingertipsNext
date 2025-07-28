using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.TestData;

internal static class BatchExamples
{
    private const string BatchId = "41101_2020-03-07T14:22:37.123";
    private const int IndicatorId = 41101;
    private const BatchStatus BatchStatus = DataManagement.Repository.Models.BatchStatus.Received;
    private const string OriginalFileName = "upload.csv";

    private const string UserId = "4fbbbb61-ed6d-4777-943c-7d597f90445a";
    private static readonly DateTime CreatedAt = new(2017, 6, 30, 18, 49, 37);
    private static readonly DateTime PublishedAt = new(2020, 3, 7, 0, 0, 0);

    public static readonly Batch Batch = new()
    {
        BatchId = BatchId,
        IndicatorId = IndicatorId,
        Status = BatchStatus,
        OriginalFileName = OriginalFileName,
        UserId = UserId,
        CreatedAt = CreatedAt,
        PublishedAt = PublishedAt
    };

    public static readonly BatchModel BatchModel = new()
    {
        BatchId = BatchId,
        IndicatorId = IndicatorId,
        Status = BatchStatus,
        OriginalFileName = OriginalFileName,
        UserId = UserId,
        CreatedAt = CreatedAt,
        PublishedAt = PublishedAt
    };
}