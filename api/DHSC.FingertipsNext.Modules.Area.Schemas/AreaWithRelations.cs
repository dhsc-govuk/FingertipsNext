using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
public class AreaWithRelations
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
    /// The name of the associated hierarchy for the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. NHS
    /// </remarks>
    [JsonPropertyName("hierarchyName")]
    public required string HierarchyName { get; init; }

    /// <summary>
    /// The type of the area / geography
    /// </summary>
    /// <remarks>
    /// e.g. PCN
    /// </remarks>
    [JsonPropertyName("areaType")]
    public required string AreaType { get; init; }

    /// <summary>
    /// The level in the hierarchy
    /// </summary>
    /// <remarks>
    /// e.g. 3
    /// </remarks>
    [JsonPropertyName("level")]
    public int Level { get; init; }

    [JsonPropertyName("parent")]
    public Area? Parent { get; init; } = null;

    [JsonPropertyName("children")]
    public Area[] Children { get; init; } = [];

    [JsonPropertyName("ancestors")]
    public Area[] Ancestors { get; init; } = [];
}
