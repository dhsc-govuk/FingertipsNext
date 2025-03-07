using TrendAnalysisApp.Repository;

namespace TrendAnalysisApp;

/// <summary>
/// The Trend Data Processor Class.
/// </summary>
/// <param name="healthMeasureRepo">Repository for health measure data</param>
public class TrendDataProcessor(HealthMeasureRepository healthMeasureRepo)
{
    private readonly HealthMeasureRepository _healthMeasureRepo = healthMeasureRepo;


    /// <summary>
    /// Entrypoint for processing the trend data.
    /// </summary>
    public async Task Process()
    {
        // TODO - DHSCFT-374 Trend Analysis - remove the below and actually process all indicators
        var areaCode = "E92000001"; // England
        var indicatorKey = 0; // Preventable sight loss from diabetic eye disease

        var result = await _healthMeasureRepo.GetForUniqueDimension(areaCode, indicatorKey);

        Console.WriteLine($"Retrieved data for indicator: {result.First().IndicatorDimension?.IndicatorId}");
        Console.WriteLine($"Most recent year with data recorded: {result.First().Year}");
        Console.WriteLine($"Retrieved {result.Count()} data points for the health measure");
    }
}
