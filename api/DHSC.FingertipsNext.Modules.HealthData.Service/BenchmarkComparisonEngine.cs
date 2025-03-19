using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     Given two HealthDataPoints determines the benchmark comparison
/// </summary>
public static class BenchmarkComparisonEngine
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
        HealthDataForArea benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity
    )
    {
        var allHealthAreasOfInterest = healthDataForAreasOfInterest
            .Where(healthDataForArea => healthDataForArea.AreaCode != benchmarkHealthData.AreaCode);

        foreach (var healthAreaData in allHealthAreasOfInterest)
            ProcessBenchmarkComparisonsForArea(healthAreaData, benchmarkHealthData, comparisonMethod,
                polarity);

        return healthDataForAreasOfInterest;
    }

    private static void ProcessBenchmarkComparisonsForArea(HealthDataForArea areaHealthData,
        HealthDataForArea benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity)
    {
        var areaHealthDataPoints = areaHealthData.HealthData;
        foreach (var healthDataPointOfInterest in areaHealthDataPoints) ProcessBenchmarkComparisonsForAreaPoint(
            healthDataPointOfInterest,
            areaHealthData,
            benchmarkHealthData,
            comparisonMethod,
            polarity);
        
    }

    private static void ProcessBenchmarkComparisonsForAreaPoint(
        HealthDataPoint healthDataPointOfInterest,
        HealthDataForArea areaHealthData,
        HealthDataForArea benchmarkHealthData,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity
        )
    {
        var areaHealthDataPoints = areaHealthData.HealthData;
        var areaCode = areaHealthData.AreaCode;
        var areaName = areaHealthData.AreaName;
        
        if (healthDataPointOfInterest.LowerConfidenceInterval == null ||
            healthDataPointOfInterest.UpperConfidenceInterval == null) return;

        var benchmarkHealthDataPoints = healthDataPointOfInterest.IsAggregate
            ? benchmarkHealthData.HealthData
            : areaHealthDataPoints;
        var benchmarkHealthDataPoint = benchmarkHealthDataPoints.FirstOrDefault(item =>
            item.Year == healthDataPointOfInterest.Year &&
            item.IsAggregate && item.Value != null);

        if (benchmarkHealthDataPoint == null) return;

        var comparisonValue = 0;
        if (healthDataPointOfInterest.UpperConfidenceInterval < benchmarkHealthDataPoint.Value)
            comparisonValue = -1;
        if (healthDataPointOfInterest.LowerConfidenceInterval > benchmarkHealthDataPoint.Value)
            comparisonValue = 1;

        var benchmarkAreaCode = healthDataPointOfInterest.IsAggregate
            ? benchmarkHealthData.AreaCode
            : areaCode;
        var benchmarkAreaName = healthDataPointOfInterest.IsAggregate
            ? benchmarkHealthData.AreaName
            : areaName;

        healthDataPointOfInterest.BenchmarkComparison = new BenchmarkComparison
        {
            Method = comparisonMethod,
            Outcome = GetOutcome(comparisonValue, polarity),
            IndicatorPolarity = polarity,
            BenchmarkValue = benchmarkHealthDataPoint.Value,
            BenchmarkAreaCode = benchmarkAreaCode,
            BenchmarkAreaName = benchmarkAreaName
        };
    } 

    private static BenchmarkOutcome GetOutcome(int comparison, IndicatorPolarity polarity)
    {
        return polarity switch
        {
            IndicatorPolarity.LowIsGood => GetLowerIsGood(comparison),
            IndicatorPolarity.HighIsGood => GetHigherIsGood(comparison),
            _ => GetNoJudgement(comparison)
        };
    }

    private static BenchmarkOutcome GetNoJudgement(int comparison)
    {
        return comparison switch
        {
            < 0 => BenchmarkOutcome.Lower,
            > 0 => BenchmarkOutcome.Higher,
            _ => BenchmarkOutcome.Similar
        };
    }

    private static BenchmarkOutcome GetLowerIsGood(int comparison)
    {
        return comparison switch
        {
            < 0 => BenchmarkOutcome.Better,
            > 0 => BenchmarkOutcome.Worse,
            _ => BenchmarkOutcome.Similar
        };
    }

    private static BenchmarkOutcome GetHigherIsGood(int comparison)
    {
        return comparison switch
        {
            < 0 => BenchmarkOutcome.Worse,
            > 0 => BenchmarkOutcome.Better,
            _ => BenchmarkOutcome.Similar
        };
    }
}