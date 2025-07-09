using System.Text.Json.Serialization;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Schemas;

/// <summary>
/// Details of a health data upload batch.
/// </summary>
public class Batch
{
    /// <summary>
    /// The unique identifier of the batch.
    /// </summary>
    [JsonPropertyName("batchId")]
    public required string BatchId { get; init; }

    /// <summary>
    /// Unique ID of the indicator.
    /// </summary>
    [JsonPropertyName("indicatorId")]
    public required int IndicatorId { get; init; }

    /// <summary>
    /// The name of the file originally uploaded in order to create the batch.
    /// </summary>
    [JsonPropertyName("originalFilename")]
    public required string OriginalFileName { get; init; }

    /// <summary>
    /// When the batch was created.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public required DateTime CreatedAt { get; init; }

    /// <summary>
    /// When the data in the batch will be published.
    /// </summary>
    [JsonPropertyName("publishedAt")]
    public required DateTime PublishedAt { get; init; }

    /// <summary>
    /// The ID of the user who uploaded the batch.
    /// </summary>
    [JsonPropertyName("userId")]
    public required string UserId { get; init; }

    /// <summary>
    /// The current status of the batch.
    /// </summary>
    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public required BatchStatus Status { get; init; }
}