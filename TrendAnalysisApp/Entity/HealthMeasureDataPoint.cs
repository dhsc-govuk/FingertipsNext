namespace TrendAnalysisApp.Entity;

/// <summary>
/// The Health Measure Data Point class.
/// </summary>
public class HealthMeasureDataPoint
{
    public double? Count { get; set; }
    public double? Value { get; set; }
    public double? LowerCI { get; set; }
    public double? UpperCI { get; set; }
    public required short Year { get; set; }
}
