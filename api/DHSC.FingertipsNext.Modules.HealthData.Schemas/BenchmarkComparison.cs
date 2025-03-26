using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Benchmark type and value
/// </summary>
public class BenchmarkComparison
{
    /// <summary>
    ///     The outcome eg Higher, Lower, Better, Worse etc
    /// </summary>
    [JsonPropertyName("outcome")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BenchmarkOutcome Outcome { get; init; } = BenchmarkOutcome.NotCompared;

    [JsonPropertyName("benchmarkAreaCode")]
    public string BenchmarkAreaCode { get; init; } = string.Empty;

    [JsonPropertyName("benchmarkAreaName")]
    public string BenchmarkAreaName { get; init; } = string.Empty;

    [JsonPropertyName("benchmarkValue")] public float? BenchmarkValue { get; init; }
}