using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Models.LogClasses;

public class BatchUploadLog
{
    [JsonPropertyName("Operation")] public required string Operation { get; init; }

    [JsonPropertyName("OriginalFileName")] public required string OriginalFileName { get; init; }

    [JsonPropertyName("Timestamp")] public required DateTime Timestamp { get; init; }

    [JsonPropertyName("UserId")] public required string UserId { get; init; }

    [JsonPropertyName("PublishedAt")] public required DateTime PublishedAt { get; init; }

    [JsonPropertyName("BatchId")] public required string BatchId { get; init; }

    [JsonPropertyName("IndicatorId")] public required int IndicatorId { get; init; }
}