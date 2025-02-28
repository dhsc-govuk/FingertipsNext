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
    public void Process()
    {
        // TODO - DHSCFT-374 Trend Analysis - remove the below and actually process all indicators
        var ageKey = 483; // <= 75 yrs
        var areaKey = 3333; // England
        var indicatorKey = 1; // Under 75 mortality from all causes
        var sexKey = 1; // Male

        var result = _healthMeasureRepo.GetForUniqueDimension(ageKey, areaKey, indicatorKey, sexKey);

        Console.WriteLine($"Retrieved data for indicator: {result.IndicatorDimensionKey}");
        Console.WriteLine($"Most recent year with data recorded: {result.MostRecentYearRecorded}");
        Console.WriteLine($"Retrieve {result.Data.Count} data points for the health measure");
    }
}
