using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Benchmark type and value
/// </summary>
public class HealthDataPointBenchmark
{
    /// <summary>
    ///     The value
    /// </summary>
    [JsonPropertyName("value")]
    public string Value { get; init; } = string.Empty;

    /// <summary>
    ///     Type
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; init; } = string.Empty;
}