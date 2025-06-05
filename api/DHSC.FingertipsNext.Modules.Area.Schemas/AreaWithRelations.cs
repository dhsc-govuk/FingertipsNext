using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.AreaData.Schemas;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
public class AreaWithRelations : Area
{
    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("parents")]
    public IList<Area> Parents { get; init; } = [];

    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("children")]
    public IList<Area> Children { get; init; } = [];

    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("siblings")]
    public IList<Area> Siblings { get; init; } = [];
}
