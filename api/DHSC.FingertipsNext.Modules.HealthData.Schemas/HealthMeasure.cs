namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

[Serializable]
public class HealthMeasure
{
    public required int HealthMeasureKey { get; set; }
    public required AgeDimension AgeDimension { get; set; }
    public required AreaDimension AreaDimension { get; set; }
    public required IndicatorDimension IndicatorDimension  { get; set; }
    public required SexDimension SexDimension { get; set; }
    public required TrendDimension TrendDimension {get; set;}
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    public required int Year { get; set; }
}
