namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

[Serializable]
public class SexDimension
{
    public required int SexKey { get; set; }
    public required string Name { get; set; }
    public required bool IsFemale { get; set; }
    public required bool HasValue { get; set; }
    public required int SexId { get; set; }
}
