namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

[Serializable]
public class AreaDimension
{
    public required int AreaKey { get; set; }
    public required string Code { get; set; }
    public required string Name { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}