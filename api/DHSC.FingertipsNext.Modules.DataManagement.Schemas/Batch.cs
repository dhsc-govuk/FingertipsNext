using System.Text.Json.Serialization;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Schemas;

/// <summary>
///     Details of a health data upload batch.
/// </summary>
public record Batch
{
    /// <summary>
    ///     The unique identifier of the batch.
    /// </summary>
    /// <example>41101_2025-03-07T14:22:37.123</example>
    [JsonPropertyName("batchId")]
    public required string BatchId { get; init; }

    /// <summary>
    ///     Unique ID of the indicator.
    /// </summary>
    /// <example>21404</example>
    [JsonPropertyName("indicatorId")]
    public required int IndicatorId { get; init; }

    /// <summary>
    ///     The name of the file originally uploaded in order to create the batch.
    /// </summary>
    /// <example>upload.csv</example>
    [JsonPropertyName("originalFilename")]
    public required string OriginalFilename { get; init; }

    /// <summary>
    ///     When the batch was created.
    /// </summary>
    /// <example>2025-06-30T14:44:53.643Z</example>
    [JsonPropertyName("createdAt")]
    public required DateTime CreatedAt { get; init; }

    /// <summary>
    ///     When the data in the batch will be published.
    /// </summary>
    /// <example>2025-07-30T00:00:00.000Z</example>
    [JsonPropertyName("publishedAt")]
    public required DateTime PublishedAt { get; init; }

    /// <summary>
    ///     The ID of the user who uploaded the batch.
    /// </summary>
    /// <example>e14dae4e-4c3c-4e13-979a-4aa6566e06a7</example>
    [JsonPropertyName("userId")]
    public required Guid UserId { get; init; }

    /// <summary>
    ///     The current status of the batch.
    /// </summary>
    /// <example>Received</example>
    [JsonPropertyName("status")]
    public required BatchStatus Status { get; init; }
}