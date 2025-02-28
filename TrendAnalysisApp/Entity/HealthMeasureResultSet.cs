namespace TrendAnalysisApp.Entity;

/// <summary>
/// The Health Measure Result Set class.
/// This represents a health measure - with dimensions - and the associated data points.
/// </summary>
public class HealthMeasureResultSet
{
    // TODO - DHSCFT-374 Trend Analysis - need to investigate and add data for the useProportionsForTrend flag
    public required int AgeDimensionKey { get; set; }
    public required int AreaDimensionKey { get; set; }
    public required short IndicatorDimensionKey { get; set; }
    public required byte SexDimensionKey { get; set; }
    public required short MostRecentYearRecorded { get; set; }
    public required List<HealthMeasureDataPoint> Data { get; set; }
}
