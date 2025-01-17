using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
/// Associates a list of health data points with the relevant
/// geographical area (represented by its unique code).
/// </summary>
public class HealthDataForArea
{
    /// <summary>
    /// The unique area code that the health data is for
    /// </summary>
    [JsonPropertyName("areaCode")]
    public string AreaCode { get; init; } = String.Empty;

    /// <summary>
    /// The health data points for the area and indicator
    /// </summary>
    [JsonPropertyName("healthData")]
    public IEnumerable<HealthDataPoint> HealthData { get; init; } = [];
}