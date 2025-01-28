using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
public class AreaWithRelations: Area
{
    /// <summary>
    /// 
    /// </summary>
    [JsonPropertyName("parent")]
    public Area? Parent { get; init; } = null;

    /// <summary>
    /// 
    /// </summary>
    [JsonPropertyName("children")]
    public Area[] Children { get; init; } = [];

    /// <summary>
    /// 
    /// </summary>
    [JsonPropertyName("ancestors")]
    public Area[] Ancestors { get; init; } = [];
}
