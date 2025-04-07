using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Age dimension details for a health data point.
/// </summary>
public class Age
{
    /// <summary>
    ///     Age band which the data are for.
    /// </summary>
    [JsonPropertyName("value")]
    public string Value { get; init; }

    /// <summary>
    ///     Indicates if the datapoint is an aggregated value for the age dimension
    /// </summary>
    [JsonPropertyName("isAggregate")]
    public bool IsAggregate { get; init; }
}
