namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

[Serializable]
public class AgeDimension
{
    public required int AgeKey { get; set; }
    public required string Name { get; set; }
    public required int AgeId { get; set; }
}
