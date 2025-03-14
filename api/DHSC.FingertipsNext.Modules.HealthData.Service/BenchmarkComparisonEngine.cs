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
        {
            var areaHealthData = healthAreaData.HealthData;
            foreach (var healthDataPointOfInterest in healthAreaData.HealthData)
            {
                var isInequality = IsInequalityDataPoint(healthDataPointOfInterest);
                var benchmarkHealthDataPoints = isInequality ? areaHealthData : benchmarkHealthData.HealthData;
                var benchmarkHealthDataPoint = benchmarkHealthDataPoints.FirstOrDefault(item =>
                    item.Year == healthDataPointOfInterest.Year &&
                    !IsInequalityDataPoint(item));

                if (benchmarkHealthDataPoint == null)
                    continue;

                var comparisonValue = 0;
                if (healthDataPointOfInterest.UpperConfidenceInterval < benchmarkHealthDataPoint.Value)
                    comparisonValue = -1;
                if (healthDataPointOfInterest.LowerConfidenceInterval > benchmarkHealthDataPoint.Value)
                    comparisonValue = 1;

                var benchmarkAreaCode = isInequality ? healthAreaData.AreaCode : benchmarkHealthData.AreaCode;
                var benchmarkAreaName = isInequality ? healthAreaData.AreaName : benchmarkHealthData.AreaName;

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
        }

        return healthDataForAreasOfInterest;
    }

    private static BenchmarkOutcome GetOutcome(int comparison, IndicatorPolarity polarity)
    {
        switch (polarity)
        {
            case IndicatorPolarity.LowIsGood:
                return GetLowerIsGood(comparison);
            case IndicatorPolarity.HighIsGood:
                return GetHigherIsGood(comparison);
            default:
                return GetNoJudgement(comparison);
        }
    }

    private static BenchmarkOutcome GetNoJudgement(int comparison)
    {
        switch (comparison)
        {
            case < 0:
                return BenchmarkOutcome.Lower;
            case > 0:
                return BenchmarkOutcome.Higher;
            default:
                return BenchmarkOutcome.Similar;
        }
    }

    private static BenchmarkOutcome GetLowerIsGood(int comparison)
    {
        switch (comparison)
        {
            case < 0:
                return BenchmarkOutcome.Better;
            case > 0:
                return BenchmarkOutcome.Worse;
            default:
                return BenchmarkOutcome.Similar;
        }
    }

    private static BenchmarkOutcome GetHigherIsGood(int comparison)
    {
        switch (comparison)
        {
            case < 0:
                return BenchmarkOutcome.Worse;
            case > 0:
                return BenchmarkOutcome.Better;
            default:
                return BenchmarkOutcome.Similar;
        }
    }

    private static bool IsInequalityDataPoint(HealthDataPoint healthDataPoint)
    {
        if (healthDataPoint.Sex != "Persons") return true;
        if (healthDataPoint.AgeBand != "All ages") return true;
        // add any other conditions here that might determine if a datapoint is an inequality point or not
        return false;
    }
}