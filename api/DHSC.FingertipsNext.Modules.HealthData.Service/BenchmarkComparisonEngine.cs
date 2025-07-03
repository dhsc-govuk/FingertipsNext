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
        HealthDataForArea? benchmarkHealthData,
        IndicatorPolarity polarity
    )
    {
        ArgumentNullException.ThrowIfNull(healthDataForAreasOfInterest);
        foreach (var healthAreaData in healthDataForAreasOfInterest)
            ProcessBenchmarkComparisonsForArea(healthAreaData, benchmarkHealthData,
                polarity);

        return healthDataForAreasOfInterest;
    }

    [Obsolete]
    private static void ProcessBenchmarkComparisonsForArea(
        HealthDataForArea areaHealthData,
        HealthDataForArea? benchmarkHealthData,
        IndicatorPolarity polarity)
    {
        // Deprecated Benchmarking
        foreach (var healthDataPointOfInterest in areaHealthData.HealthData)
            ProcessBenchmarkComparisonsForAreaPoint(
            healthDataPointOfInterest,
            areaHealthData,
            benchmarkHealthData,
            polarity);

        // Now perform Benchmarking for each Indicator Segment
        if (benchmarkHealthData != null)
        {
            // We don't benchmark an area against itself!
            if (benchmarkHealthData.AreaCode == areaHealthData.AreaCode)
                return;

            // This is basic benchmarking between targetArea and benchmarkArea for equivalent segments
            foreach (var targetSegment in areaHealthData.IndicatorSegments)
            {
                var benchmarkSegment = SelectMatchingSegment(targetSegment, benchmarkHealthData.IndicatorSegments);
                if (benchmarkSegment == null)
                    continue;
                ProcessBenchmarkComparisonsForAreaSegment(
                    targetSegment,
                    benchmarkSegment,
                    benchmarkHealthData.AreaCode,
                    benchmarkHealthData.AreaName,
                    polarity
                    );
            }
        }
        else
        {
            // Perform Inequality benchmarking against aggregate segment
            var aggregateSegment = areaHealthData.IndicatorSegments.First(segment => segment.IsAggregate == true);
            foreach (var targetSegment in areaHealthData.IndicatorSegments)
            {
                ProcessBenchmarkComparisonsForAreaSegment(
                    targetSegment,
                    aggregateSegment,
                    areaHealthData.AreaCode,
                    areaHealthData.AreaName,
                    polarity
                    );
            }

        }
    }

    private static IndicatorSegment? SelectMatchingSegment(IndicatorSegment targetSegment, IEnumerable<IndicatorSegment> benchmarkSegments)
    {
        if (benchmarkSegments == null)
            return null;

        return benchmarkSegments.FirstOrDefault(
            segment => segment.Sex.Value == targetSegment.Sex.Value
        );
    }

    private static void ProcessBenchmarkComparisonsForAreaSegment(
        IndicatorSegment targetSegment,
        IndicatorSegment benchmarkSegment,
        string benchmarkAreaCode,
        string benchmarkAreaName,
        IndicatorPolarity polarity)
    {
        foreach (var targetDataPoint in targetSegment.HealthData)
        {
            if (targetDataPoint.LowerConfidenceInterval == null || targetDataPoint.UpperConfidenceInterval == null)
                continue;

            var benchmarkDataPoint = benchmarkSegment.HealthData.FirstOrDefault(benchmark =>
                benchmark.DatePeriod.To == targetDataPoint.DatePeriod.To && // must be the same date period
                benchmark.DatePeriod.From == targetDataPoint.DatePeriod.From && // must be the same date period
                benchmark.Deprivation.IsAggregate == true && // The benchmark must always be the aggregate for this segment - this is relevant to inequality benchmarking
                benchmark.AgeBand.IsAggregate == true // The benchmark must always be the aggregate for this segment - this is relevant to inequality benchmarking
                );

            if (benchmarkDataPoint == null || benchmarkDataPoint == targetDataPoint)
                continue;

            targetDataPoint.BenchmarkComparison = CompareDataPoints(targetDataPoint, benchmarkDataPoint, polarity, benchmarkAreaCode, benchmarkAreaName);
        }
    }

    private static BenchmarkComparison CompareDataPoints(HealthDataPoint targetDataPoint, HealthDataPoint benchmarkDataPoint, IndicatorPolarity polarity, string benchmarkAreaCode, string benchmarkAreaName)
    {
        var comparisonValue = 0;

        if (targetDataPoint.UpperConfidenceInterval < benchmarkDataPoint.Value)
            comparisonValue = -1;

        if (targetDataPoint.LowerConfidenceInterval > benchmarkDataPoint.Value)
            comparisonValue = 1;

        return new BenchmarkComparison
        {
            Outcome = GetOutcome(comparisonValue, polarity),
            BenchmarkValue = benchmarkDataPoint.Value,
            BenchmarkAreaCode = benchmarkAreaCode,
            BenchmarkAreaName = benchmarkAreaName
        };

    }

    private static void ProcessBenchmarkComparisonsForAreaPoint
    (
        HealthDataPoint healthDataPointOfInterest,
        HealthDataForArea areaHealthData,
        HealthDataForArea? benchmarkHealthData,
        IndicatorPolarity polarity
    )
    {
        if (healthDataPointOfInterest.LowerConfidenceInterval == null || healthDataPointOfInterest.UpperConfidenceInterval == null)
            return;

        IEnumerable<HealthDataPoint> benchmarkDataPoints;
        string benchmarkAreaCode;
        string benchmarkAreaName;

        if (healthDataPointOfInterest.IsAggregate)
        {
            if (benchmarkHealthData == null)
            {
                return;
            }

            benchmarkDataPoints = benchmarkHealthData.HealthData;
            benchmarkAreaCode = benchmarkHealthData.AreaCode;
            benchmarkAreaName = benchmarkHealthData.AreaName;
        }
        else
        {
            benchmarkDataPoints = areaHealthData.HealthData;
            benchmarkAreaCode = areaHealthData.AreaCode;
            benchmarkAreaName = areaHealthData.AreaName;
        }

        var benchmarkHealthDataPoint = benchmarkDataPoints.FirstOrDefault(item =>
            item != healthDataPointOfInterest && // cannot be compared to itself
            item.DatePeriod.To == healthDataPointOfInterest.DatePeriod.To && // must be the same date period
            item.DatePeriod.From == healthDataPointOfInterest.DatePeriod.From && // must be the same date period
            item.IsAggregate && // must be an aggregate point
            item.Value != null // must have a value
            );

        if (benchmarkHealthDataPoint == null)
        {
            return;
        }

        var comparisonValue = 0;

        if (healthDataPointOfInterest.UpperConfidenceInterval < benchmarkHealthDataPoint.Value)
            comparisonValue = -1;

        if (healthDataPointOfInterest.LowerConfidenceInterval > benchmarkHealthDataPoint.Value)
            comparisonValue = 1;

        healthDataPointOfInterest.BenchmarkComparison = new BenchmarkComparison
        {
            Outcome = GetOutcome(comparisonValue, polarity),
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