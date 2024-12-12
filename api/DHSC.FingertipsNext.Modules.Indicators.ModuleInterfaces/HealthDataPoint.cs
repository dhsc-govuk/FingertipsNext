using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

/// <summary>
/// Represents a health data point for a public health indicator with
/// a count, value, upper confidence interval, lower confidence interval
/// and a year.
/// </summary>
public class HealthDataPoint
{
    /// <summary>
    /// The year that the data point is for
    /// </summary>
    [JsonPropertyName("year")]
    public int Year { get; init; }
    
    /// <summary>
    /// The count
    /// </summary>
    [JsonPropertyName("count")]
    public float Count { get; init; }
    
    /// <summary>
    /// The value
    /// </summary>
    [JsonPropertyName("value")]
    public float Value { get; init; }
    
    /// <summary>
    /// The lower confidence interval
    /// </summary>
    [JsonPropertyName("lowerCi")]
    public float LowerConfidenceInterval { get; init; }
    
    /// <summary>
    /// The upper confidence interval
    /// </summary>
    [JsonPropertyName("upperCi")]
    public float UpperConfidenceInterval { get; init; }
}