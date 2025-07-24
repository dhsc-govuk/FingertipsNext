using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Models.LogClasses;
//

public class BatchDeleteLog
{
    [JsonPropertyName("OriginalFileName")] public required string OriginalFileName { get; init; }

    [JsonPropertyName("Timestamp")] public required DateTime? Timestamp { get; init; }

    // User who deleted the batch
    [JsonPropertyName("UserId")] public required Guid? UserId { get; init; }

    [JsonPropertyName("PublishedAt")] public required DateTime PublishedAt { get; init; }

    [JsonPropertyName("BatchId")] public required string BatchId { get; init; }

    [JsonPropertyName("IndicatorId")] public required int IndicatorId { get; init; }
}