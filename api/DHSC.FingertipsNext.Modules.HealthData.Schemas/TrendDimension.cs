namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
/// The Trend Dimension.
/// Simple object to represent different statistical trends.
/// </summary>
[Serializable]
public class TrendDimension
{
    public required int TrendKey { get; set; }
    public required string Name { get; set; }
    public required bool HasValue { get; set; }
}
