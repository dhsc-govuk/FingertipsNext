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
            // Perform Inequality benchmarking against aggregate segment
            var aggregateSegment = areaHealthData.IndicatorSegments.FirstOrDefault(segment => segment.IsAggregate);
            var newIndicatorSegments = new List<IndicatorSegment>();

            // There may not be an aggregateSegment available - check for this and just return the original segments without benchmarking
            if (aggregateSegment != null)
            {
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
            }
            else
            {
                newIndicatorSegments.AddRange(areaHealthData.IndicatorSegments);
            }

            var newAreaHealthData = new HealthDataForArea
            {
                AreaCode = areaHealthData.AreaCode,
                AreaName = areaHealthData.AreaName,
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
        // We don't benchmark an area against itself!
        if (benchmarkHealthData.AreaCode == areaHealthData.AreaCode)
        {
            // Always return a new instance
            return new HealthDataForArea
            {
                AreaCode = areaHealthData.AreaCode,
                AreaName = areaHealthData.AreaName,
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
            }
            else
            {
                var newSegment = ProcessBenchmarkComparisonsForAreaSegment(
                    targetSegment,
                    benchmarkSegment,
                    benchmarkHealthData.AreaCode,
                    benchmarkHealthData.AreaName,
                    polarity
                );
                newIndicatorSegments.Add(newSegment);
            }
        }

        return new HealthDataForArea
        {
            AreaCode = areaHealthData.AreaCode,
            AreaName = areaHealthData.AreaName,
            IndicatorSegments = newIndicatorSegments
        };
    }

    private static IndicatorSegment? SelectMatchingSegment(IndicatorSegment targetSegment, IEnumerable<IndicatorSegment> benchmarkSegments)
    {
        if (benchmarkSegments == null)
            return null;

        return benchmarkSegments.FirstOrDefault(
            segment => segment.Sex.Value == targetSegment.Sex.Value &&
            segment.Age.Value == targetSegment.Age.Value &&
            segment.ReportingPeriod == targetSegment.ReportingPeriod
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
                benchmark.Deprivation.IsAggregate
            );

            if (benchmarkDataPoint == null || benchmarkDataPoint == targetDataPoint)
            {
                newHealthDataPoints.Add(targetDataPoint);
                continue;
            }

            // Create a copy with BenchmarkComparison set
            var newDataPoint = new HealthDataPoint
            {
                DatePeriod = targetDataPoint.DatePeriod,
                Count = targetDataPoint.Count,
                Value = targetDataPoint.Value,
                LowerConfidenceInterval = targetDataPoint.LowerConfidenceInterval,
                UpperConfidenceInterval = targetDataPoint.UpperConfidenceInterval,
                Deprivation = targetDataPoint.Deprivation,
                Trend = targetDataPoint.Trend,
                IsAggregate = targetDataPoint.IsAggregate,
                BenchmarkComparison = CompareDataPoints(targetDataPoint, benchmarkDataPoint, polarity, benchmarkAreaCode, benchmarkAreaName)
            };

            newHealthDataPoints.Add(newDataPoint);
        }

        return new IndicatorSegment
        {
            Age = targetSegment.Age,
            Sex = targetSegment.Sex,
            ReportingPeriod = targetSegment.ReportingPeriod,
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