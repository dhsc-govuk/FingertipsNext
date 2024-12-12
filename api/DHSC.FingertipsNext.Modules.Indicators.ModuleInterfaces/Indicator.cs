using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

/// <summary>
/// A public health indicator
/// </summary>
public class Indicator
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
    
    /// <summary>
    /// The definition of the indicator
    /// </summary>
    [JsonPropertyName("definition")]
    public string Definition  { get; init; } = String.Empty;
}