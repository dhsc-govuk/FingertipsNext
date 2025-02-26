using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
/// Benchmark type and value
/// </summary>
public class HealthDataPointBenchmark
{
    /// <summary>
    /// The value
    /// </summary>
    [JsonPropertyName("value")]
    public string? Value { get; init; } = String.Empty;
    
    /// <summary>
    /// Type
    /// </summary>
    [JsonPropertyName("type")]
    public string? Type { get; init; } = String.Empty;
    
    /// <summary>
    /// The compared value
    /// </summary>
    [JsonPropertyName("comparedTo")]
    public float? ComparedTo { get; init; }
}