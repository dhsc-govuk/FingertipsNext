using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// A area or geography that has associated public health data
/// </summary>
public class Area
{
    /// <summary>
    /// The unique area code of the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. E06000047
    /// </remarks>
    [JsonPropertyName("code")]
    public required string Code { get; init; }

    /// <summary>
    /// The name of the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. County Durham
    /// </remarks>
    [JsonPropertyName("name")]
    public required string Name { get; init; }

    /// <summary>
    /// 
    /// </summary>
    [JsonPropertyName("areaType")]
    public required AreaType AreaType { get; init; }
}