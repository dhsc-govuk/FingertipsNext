using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Deprivation dimension details for a health data point.
/// </summary>
public class Deprivation
{
    /// <summary>
    ///     A number which represents this deprivation value's inherent place in the sequence of all values for
    ///     this deprivation type.
    /// </summary>
    [JsonPropertyName("sequence")]
    public int Sequence { get; init; }

    /// <summary>
    ///     The deprivation value for this data point
    /// </summary>
    [JsonPropertyName("value")]
    public string Value { get; init; }

    /// <summary>
    ///     The deprivation category that this data point's deprivation value belongs to.
    /// </summary>
    [JsonPropertyName("type")]
    public string Type { get; init; }
}
