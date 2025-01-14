namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

[Serializable]
public class IndicatorDimension
{
    public required int IndicatorKey { get; set; }
    public required string Name { get; set; }
    public required int IndicatorId { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}
