using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     Loops over the area data applying benchmark comparisons
/// </summary>
public static class BenchmarkComparisonIterator
{
    /// <summary>
    ///     Loops over the area data applying benchmark comparisons
    /// </summary>
    /// <param name="healthDataForAreasOfInterest">
    ///     The areas which need benchmarking
    /// </param>
    /// <param name="benchmarkHealthData">
    ///     The area data which is to be benchmarked against
    /// </param>
    /// <param name="comparisonMethod">
    ///     The comparison method to be applied e.g. Rag
    /// </param>
    /// <param name="polarity">
    ///     The indicator polarity applied to the comparison e.g. HighIsGood
    /// </param>
    /// <returns>
    ///     An enumerable of <c>HealthDataForArea</c>
    /// </returns>
    public static IEnumerable<HealthDataForArea> ProcessBenchmarkComparisons(
        IEnumerable<HealthDataForArea> healthDataForAreasOfInterest,
        HealthDataForArea? benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity
    )
    {
        // if method or benchmark data is missing then no benchmarking is applied
        if (comparisonMethod != BenchmarkComparisonMethod.Rag || benchmarkHealthData == null)
            return healthDataForAreasOfInterest;

        return healthDataForAreasOfInterest.Select(healthDataForAreaOfInterest =>
            ProcessBenchmarkComparisonsForArea(
                healthDataForAreaOfInterest,
                benchmarkHealthData,
                comparisonMethod,
                polarity
            )
        );
    }

    // loop over the data points for a specific area adding benchmark data
    private static HealthDataForArea ProcessBenchmarkComparisonsForArea(
        HealthDataForArea healthDataForAreaOfInterest,
        HealthDataForArea benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity
    )
    {
        if (healthDataForAreaOfInterest.AreaCode == benchmarkHealthData.AreaCode) return healthDataForAreaOfInterest;

        healthDataForAreaOfInterest.HealthData = healthDataForAreaOfInterest.HealthData.Select(
            healthDataPointOfInterest => ProcessBenchmarkComparisonForPoint(
                healthDataPointOfInterest,
                benchmarkHealthData,
                comparisonMethod,
                polarity
            )
        );
        return healthDataForAreaOfInterest;
    }

    // find a matching benchmark value and apply the benchmark comparison to as specific data point
    private static HealthDataPoint ProcessBenchmarkComparisonForPoint(
        HealthDataPoint healthDataPointOfInterest,
        HealthDataForArea benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity indicatorPolarity
    )
    {
        var benchmarkHealthDataPoint = GetBenchMarkYear(benchmarkHealthData, healthDataPointOfInterest.Year);
        if (benchmarkHealthDataPoint == null) return healthDataPointOfInterest;

        healthDataPointOfInterest.BenchmarkComparison = BenchmarkComparisonEngine.GetBenchmarkComparison(
            healthDataPointOfInterest,
            benchmarkHealthDataPoint,
            comparisonMethod,
            indicatorPolarity,
            benchmarkHealthData.AreaCode,
            benchmarkHealthData.AreaName
        );
        return healthDataPointOfInterest;
    }

    // find the benchmark datapoint for a given year
    private static HealthDataPoint? GetBenchMarkYear(HealthDataForArea benchmarkHealthData, int year)
    {
        return benchmarkHealthData.HealthData.FirstOrDefault(item => item.Year == year);
    }
}