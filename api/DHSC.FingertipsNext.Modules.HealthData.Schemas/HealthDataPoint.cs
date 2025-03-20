using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Represents a health data point for a public health indicator with
///     a count, value, upper confidence interval, lower confidence interval, year, ageBand and sex.
/// </summary>
public class HealthDataPoint
{
    /// <summary>
    ///     The year that the data point is for
    /// </summary>
    [JsonPropertyName("year")]
    public int Year { get; init; }

    /// <summary>
    ///     The count
    /// </summary>
    [JsonPropertyName("count")]
    public float? Count { get; init; }

    /// <summary>
    ///     The value
    /// </summary>
    [JsonPropertyName("value")]
    public float? Value { get; init; }

    /// <summary>
    ///     The lower confidence interval
    /// </summary>
    [JsonPropertyName("lowerCi")]
    public float? LowerConfidenceInterval { get; init; }

    /// <summary>
    ///     The upper confidence interval
    /// </summary>
    [JsonPropertyName("upperCi")]
    public float? UpperConfidenceInterval { get; init; }

    /// <summary>
    ///     Age band which the data are for.
    /// </summary>
    [JsonPropertyName("ageBand")]
    public string? AgeBand { get; init; } = string.Empty;
    
    /// <summary>
    ///     Age band which the data are for.
    /// </summary>
    [JsonPropertyName("deprivation")]
    public required Deprivation Deprivation { get; init; }

    /// <summary>
    ///     Sex which the data are for.
    /// </summary>
    [JsonPropertyName("sex")]
    public string? Sex { get; init; } = string.Empty;

    /// <summary>
    ///     The statistical trend that applies to the data point, given the preceding data.
    ///     Will only be calculated if there are at least 5 data points to use.
    ///     Values can be: Increasing/(and getting worse/better), Decreasing/(and getting worse/better),
    ///     No change, Cannot be calculated and Not yet calculated.
    /// </summary>
    [JsonPropertyName("trend")]
    public string? Trend { get; init; } = string.Empty;

    /// <summary>
    ///     Benchmark which the data are for.
    /// </summary>
    [JsonPropertyName("benchmarkComparison")]
    public BenchmarkComparison? BenchmarkComparison { get; set; }

    /// <summary>
    ///     Is the data an aggregated point
    /// </summary>
    [JsonPropertyName("isAggregate")]
    public bool IsAggregate { get; set; }
}