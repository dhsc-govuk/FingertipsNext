using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     Given two HealthDataPoints determins the benchmark comparison
/// </summary>
public static class BenchmarkComparisonEngine
{
    /// <summary>
    ///     Performs a comparison between two HealthDataPoints
    /// </summary>
    /// <param name="healthDataPointOfInterest">The health data point which needs benchmarking</param>
    /// <param name="benchmarkHealthDataPoint">The health data point which the benchmarking is performed against</param>
    /// <param name="comparisonMethod">The comparison method used</param>
    /// <param name="indicatorPolarity">The indicator polarity used in the comparison</param>
    /// <param name="benchmarkAreaCode">The area code of the benchmark data</param>
    /// <param name="benchmarkAreaName">The area name of the benchmark data</param>
    /// <returns>
    ///     <c>BenchmarkComparison</c> a benchmark comparison
    /// </returns>
    public static BenchmarkComparison GetBenchmarkComparison(
        HealthDataPoint healthDataPointOfInterest,
        HealthDataPoint benchmarkHealthDataPoint,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity indicatorPolarity,
        string benchmarkAreaCode,
        string benchmarkAreaName
    )
    {
        var comparisonValue = GetComparison(healthDataPointOfInterest.LowerConfidenceInterval,
            healthDataPointOfInterest.UpperConfidenceInterval,
            benchmarkHealthDataPoint.Value);
        var outcome = BenchmarkPolarity.GetOutcome(comparisonValue, indicatorPolarity);
        return new BenchmarkComparison
        {
            Method = comparisonMethod,
            Outcome = outcome,
            IndicatorPolarity = indicatorPolarity,
            BenchmarkAreaCode = benchmarkAreaCode,
            BenchmarkAreaName = benchmarkAreaName
        };
    }

    // determine the comparison
    private static int GetComparison(float? lowerCi, float? upperCi, float? benchmark)
    {
        if (upperCi < benchmark) return -1;
        return lowerCi > benchmark ? 1 : 0;
    }
}