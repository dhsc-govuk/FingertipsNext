using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// An area type e.g. 'Region' or 'Integrated Care Board'
/// </summary>
public class AreaType
{
    /// <summary>
    /// The name of the area type for use in urls
    /// </summary>
    /// <remarks>
    /// e.g. nhs-region
    /// </remarks>
    [JsonPropertyName("key")]
    public required string Key { get; init; }

    /// <summary>
    /// The name of the area type
    /// </summary>
    /// <remarks>
    /// e.g. NHS Region
    /// </remarks>
    [JsonPropertyName("name")]
    public required string Name { get; init; }

    /// <summary>
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. NHS
    /// </remarks>
    [JsonPropertyName("hierarchyName")]
    public required string HierarchyName { get; init; }

    /// <summary>
    /// The level in the hierarchy
    /// </summary>
    /// <remarks>
    /// e.g. 3
    /// </remarks>
    [JsonPropertyName("level")]
    public int Level { get; init; }
 }