namespace TrendAnalysisApp.Repository.Models;

/// <summary>
/// The Health Measure Model class.
/// Represents the Health Measure stored DB object.
/// </summary>
public class HealthMeasureModel
{
    public required int HealthMeasureKey { get; set; }
    public required int AgeKey { get; set; }
    public required int AreaKey { get; set; }
    public required short IndicatorKey { get; set; }
    public required byte SexKey { get; set; }
    public required byte TrendKey { get; set; }
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    public required short Year { get; set; }
}
