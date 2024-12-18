using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Indicators.Schemas;

/// <summary>
///  summary of a public health indicator
/// </summary>
public class IndicatorSummary
{
    /// <summary>
    /// The unique identifier of the indicator
    /// </summary>
    [JsonPropertyName("indicator_id")]
    public int IndicatorId { get; init; }
    
    /// <summary>
    /// The title of the indicator
    /// </summary>
    [JsonPropertyName("title")]
    public string Title { get; init; } = String.Empty;
}