using System.Text.Json.Serialization;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Schemas;

/// <summary>
/// Details of a health data upload batch.
/// </summary>
public class Batch(string batchId = "", string originalFileName = "", string userId = "")
{
    /// <summary>
    /// The unique identifier of the batch.
    /// </summary>
    [JsonPropertyName("batchId")]
    public string BatchId { get; init; } = batchId;

    /// <summary>
    /// Unique ID of the indicator.
    /// </summary>
    [JsonPropertyName("indicatorId")]
    public int IndicatorId { get; init; }
    
    /// <summary>
    /// The name of the file originally uploaded in order to create the batch.
    /// </summary>
    [JsonPropertyName("originalFilename")]
    public string OriginalFileName { get; init; } = originalFileName;

    /// <summary>
    /// When the batch was created.
    /// </summary>
    [JsonPropertyName("createdAt")]
    public DateTime CreatedAt { get; init; }
    
    /// <summary>
    /// When the data in the batch will be published.
    /// </summary>
    [JsonPropertyName("publishedAt")]
    public DateTime PublishedAt { get; init; }
    
    /// <summary>
    /// The ID of the user who uploaded the batch.
    /// </summary>
    [JsonPropertyName("userId")]
    public string UserId { get; init; } = userId;

    /// <summary>
    /// The current status of the batch.
    /// </summary>
    [JsonPropertyName("status")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BatchStatus Status { get; init; }
}