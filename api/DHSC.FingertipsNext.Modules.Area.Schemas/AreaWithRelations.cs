using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.Area.Schemas;

/// <summary>
/// An area or geography that has associated public health data
/// </summary>
public class AreaWithRelations : AreaData
{
    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("parents")]
    public IList<AreaData> Parents { get; init; } = [];

    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("children")]
    public IList<AreaData> Children { get; init; } = [];

    /// <summary>
    ///
    /// </summary>
    [JsonPropertyName("siblings")]
    public IList<AreaData> Siblings { get; init; } = [];
}
