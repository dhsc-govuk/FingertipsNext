using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// An area type e.g. PCN or GP
/// </summary>
public class AreaType
{
    /// <summary>
    /// The name of the area type
    /// </summary>
    /// <remarks>
    /// e.g. PCN
    /// </remarks>
    [JsonPropertyName("name")]
    public required string Name { get; init; }
    
    /// <summary>
    /// The level in the hierarchy
    /// </summary>
    /// <remarks>
    /// e.g. 3
    /// </remarks>
    [JsonPropertyName("level")]
    public int Level { get; init; }
    
    /// <summary>
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. NHS
    /// </remarks>
    [JsonPropertyName("hierarchyName")]
    public required string HierarchyName { get; init; }
}