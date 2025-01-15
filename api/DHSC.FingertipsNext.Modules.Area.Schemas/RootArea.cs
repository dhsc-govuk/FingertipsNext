using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// The root node of the area / geography hierarchies
/// </summary>
public class RootArea
{
    /// <summary>
    /// The unique area code of the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. E92000001
    /// </remarks>
    [JsonPropertyName("code")]
    public required string Code { get; init; }
    
    /// <summary>
    /// The name of the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. England
    /// </remarks>
    [JsonPropertyName("name")]
    public required string Name { get; init; }
}