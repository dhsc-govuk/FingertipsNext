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
    public BenchmarkOutcome Outcome { get; init; } = BenchmarkOutcome.None;

    /// <summary>
    ///     The comparison method eg Rag, Quintiles
    /// </summary>
    [JsonPropertyName("method")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public BenchmarkComparisonMethod Method { get; init; } = BenchmarkComparisonMethod.None;

    // <summary>
    /// The indicator polarity eg HighIsGood
    /// </summary>
    [JsonPropertyName("indicatorPolarity")]
    [JsonConverter(typeof(JsonStringEnumConverter))]
    public IndicatorPolarity IndicatorPolarity { get; init; } = IndicatorPolarity.NoJudgement;

    [JsonPropertyName("benchmarkAreaCode")]
    public string BenchmarkAreaCode { get; init; } = string.Empty;

    [JsonPropertyName("benchmarkAreaName")]
    public string BenchmarkAreaName { get; init; } = string.Empty;
}