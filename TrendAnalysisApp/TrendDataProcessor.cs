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
        var ageId = 227; // 12+ years
        var areaCode = "E92000001"; // England
        var indicatorId = 41203; // Preventable sight loss from diabetic eye disease
        var sexId = 4; // Persons (all)

        var result = await _healthMeasureRepo.GetForUniqueDimension(ageId, areaCode, indicatorId, sexId);

        Console.WriteLine($"Retrieved data for indicator: {result.First().IndicatorDimension?.IndicatorId}");
        Console.WriteLine($"Most recent year with data recorded: {result.First().Year}");
        Console.WriteLine($"Retrieved {result.Count()} data points for the health measure");
    }
}
