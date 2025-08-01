using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Associates a list of health data points with the relevant
///     geographical area (represented by its unique code).
/// </summary>
public class HealthDataForArea
{
    /// <summary>
    ///     The unique area code that the health data is for
    /// </summary>
    [JsonPropertyName("areaCode")]
    public string AreaCode { get; init; } = string.Empty;

    /// <summary>
    ///     The name of the geographical area
    /// </summary>
    [JsonPropertyName("areaName")]
    public string AreaName { get; init; } = string.Empty;

    /// <summary>
    ///     Segments of the indicator
    /// </summary>
    [JsonPropertyName("indicatorSegments")]
    public IEnumerable<IndicatorSegment> IndicatorSegments { get; init; } = [];

}