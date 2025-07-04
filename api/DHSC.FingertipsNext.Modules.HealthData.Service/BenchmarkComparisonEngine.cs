using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     Given two HealthDataPoints determines the benchmark comparison
/// </summary>
internal static class BenchmarkComparisonEngine
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
    internal static IEnumerable<HealthDataForArea> PerformAreaBenchmarking(
    IEnumerable<HealthDataForArea> healthDataForAreasOfInterest,
    HealthDataForArea benchmarkHealthData,
    IndicatorPolarity polarity
)
    {
        var result = new List<HealthDataForArea>();
        foreach (var healthAreaData in healthDataForAreasOfInterest)
        {
            var newArea = ProcessBenchmarkComparisonsForArea(
                healthAreaData,
                benchmarkHealthData,
                polarity);
            result.Add(newArea);
        }
        return result;
    }

    internal static IEnumerable<HealthDataForArea> PerformInequalityBenchmarking(
        IEnumerable<HealthDataForArea> healthDataForAreasOfInterest,
        IndicatorPolarity polarity
    )
    {
        var result = new List<HealthDataForArea>();

        foreach (var areaHealthData in healthDataForAreasOfInterest)
        {
            // Deprecated Benchmarking
            foreach (var healthDataPointOfInterest in areaHealthData.HealthData)
                ProcessBenchmarkComparisonsForAreaPoint(
                    healthDataPointOfInterest,
                    areaHealthData,
                    null,
                    polarity);

            // Perform Inequality benchmarking against aggregate segment
            var aggregateSegment = areaHealthData.IndicatorSegments.First(segment => segment.IsAggregate);
            var newIndicatorSegments = new List<IndicatorSegment>();
            foreach (var targetSegment in areaHealthData.IndicatorSegments)
            {
                var newSegment = ProcessBenchmarkComparisonsForAreaSegment(
                    targetSegment,
                    aggregateSegment,
                    areaHealthData.AreaCode,
                    areaHealthData.AreaName,
                    polarity
                );
                newIndicatorSegments.Add(newSegment);
            }

            var newAreaHealthData = new HealthDataForArea
            {
                AreaCode = areaHealthData.AreaCode,
                AreaName = areaHealthData.AreaName,
                HealthData = areaHealthData.HealthData,
                IndicatorSegments = newIndicatorSegments
            };

            result.Add(newAreaHealthData);
        }

        return result;
    }

    private static HealthDataForArea ProcessBenchmarkComparisonsForArea(
        HealthDataForArea areaHealthData,
        HealthDataForArea benchmarkHealthData,
        IndicatorPolarity polarity)
    {
        // Deprecated Benchmarking
        foreach (var healthDataPointOfInterest in areaHealthData.HealthData)
            ProcessBenchmarkComparisonsForAreaPoint(
                healthDataPointOfInterest,
                areaHealthData,
                benchmarkHealthData,
                polarity);

        // We don't benchmark an area against itself!
        if (benchmarkHealthData.AreaCode == areaHealthData.AreaCode)
        {
            // Always return a new instance
            return new HealthDataForArea
            {
                AreaCode = areaHealthData.AreaCode,
                AreaName = areaHealthData.AreaName,
                HealthData = areaHealthData.HealthData,
                IndicatorSegments = areaHealthData.IndicatorSegments
            };
        }

        // Now perform Benchmarking for each Indicator Segment
        var newIndicatorSegments = new List<IndicatorSegment>();
        foreach (var targetSegment in areaHealthData.IndicatorSegments)
        {
            var benchmarkSegment = SelectMatchingSegment(targetSegment, benchmarkHealthData.IndicatorSegments);
            if (benchmarkSegment == null)
            {
                newIndicatorSegments.Add(targetSegment);
                continue;
            }
            var newSegment = ProcessBenchmarkComparisonsForAreaSegment(
                targetSegment,
                benchmarkSegment,
                benchmarkHealthData.AreaCode,
                benchmarkHealthData.AreaName,
                polarity
            );
            newIndicatorSegments.Add(newSegment);
        }

        return new HealthDataForArea
        {
            AreaCode = areaHealthData.AreaCode,
            AreaName = areaHealthData.AreaName,
            HealthData = areaHealthData.HealthData,
            IndicatorSegments = newIndicatorSegments
        };
    }

    private static IndicatorSegment? SelectMatchingSegment(IndicatorSegment targetSegment, IEnumerable<IndicatorSegment> benchmarkSegments)
    {
        if (benchmarkSegments == null)
            return null;

        return benchmarkSegments.FirstOrDefault(
            segment => segment.Sex.Value == targetSegment.Sex.Value
        );
    }

    private static IndicatorSegment ProcessBenchmarkComparisonsForAreaSegment(
        IndicatorSegment targetSegment,
        IndicatorSegment benchmarkSegment,
        string benchmarkAreaCode,
        string benchmarkAreaName,
        IndicatorPolarity polarity)
    {
        var newHealthDataPoints = new List<HealthDataPoint>();

        foreach (var targetDataPoint in targetSegment.HealthData)
        {
            if (targetDataPoint.LowerConfidenceInterval == null || targetDataPoint.UpperConfidenceInterval == null)
            {
                newHealthDataPoints.Add(targetDataPoint);
                continue;
            }

            var benchmarkDataPoint = benchmarkSegment.HealthData.FirstOrDefault(benchmark =>
                benchmark.DatePeriod.To == targetDataPoint.DatePeriod.To &&
                benchmark.DatePeriod.From == targetDataPoint.DatePeriod.From &&
                benchmark.Deprivation.IsAggregate &&
                benchmark.AgeBand.IsAggregate
            );

            if (benchmarkDataPoint == null || benchmarkDataPoint == targetDataPoint)
            {
                newHealthDataPoints.Add(targetDataPoint);
                continue;
            }

            // Create a copy with BenchmarkComparison set
            var newDataPoint = new HealthDataPoint
            {
                Year = targetDataPoint.Year,
                DatePeriod = targetDataPoint.DatePeriod,
                Count = targetDataPoint.Count,
                Value = targetDataPoint.Value,
                LowerConfidenceInterval = targetDataPoint.LowerConfidenceInterval,
                UpperConfidenceInterval = targetDataPoint.UpperConfidenceInterval,
                AgeBand = targetDataPoint.AgeBand,
                Deprivation = targetDataPoint.Deprivation,
                Sex = targetDataPoint.Sex,
                Trend = targetDataPoint.Trend,
                IsAggregate = targetDataPoint.IsAggregate,
                BenchmarkComparison = CompareDataPoints(targetDataPoint, benchmarkDataPoint, polarity, benchmarkAreaCode, benchmarkAreaName)
            };

            newHealthDataPoints.Add(newDataPoint);
        }

        return new IndicatorSegment
        {
            Sex = targetSegment.Sex,
            IsAggregate = targetSegment.IsAggregate,
            HealthData = newHealthDataPoints
        };
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