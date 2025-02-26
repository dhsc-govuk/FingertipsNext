using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class BenchmarkComparisonEngine(HealthDataForArea benchmarkData, IndicatorPolarity polarity)
{
    private HealthDataForArea _benchmarkData { get; } = benchmarkData;
    private IndicatorPolarity _polarity { get; } = polarity;

    public IEnumerable<HealthDataForArea> EnrichHealthDataForMultipleAreas(IEnumerable<HealthDataForArea> allAreaData)
    {
        return allAreaData.Select(EnrichHealthDataForArea);
    }

    private HealthDataForArea EnrichHealthDataForArea(HealthDataForArea areaData)
    {
        if (areaData.AreaCode == _benchmarkData.AreaCode) return areaData;
        areaData.HealthData = areaData.HealthData.Select(EnrichHealthPoint);
        return areaData;
    }

    private HealthDataPoint EnrichHealthPoint(HealthDataPoint dataPoint)
    {
        var benchmarkPoint = GetBenchMarkYear(dataPoint.Year);
        if (benchmarkPoint == null) return dataPoint;

        var comparisonValue = GetComparison(dataPoint.LowerConfidenceInterval, dataPoint.UpperConfidenceInterval,
            benchmarkPoint.Value);
        var outcome = BenchmarkPolarity.GetOutcome(comparisonValue, _polarity);
        dataPoint.BenchmarkComparison = new BenchmarkComparison
        {
            Method = BenchmarkComparisonMethod.Rag,
            Outcome = outcome,
            IndicatorPolarity = _polarity,
            BenchmarkAreaCode = _benchmarkData.AreaCode,
            BenchmarkAreaName = _benchmarkData.AreaName
        };
        return dataPoint;
    }

    private HealthDataPoint? GetBenchMarkYear(int year)
    {
        return _benchmarkData.HealthData.FirstOrDefault(item => item.Year == year);
    }

    private static int GetComparison(float? lowerCi, float? upperCi, float? benchmark)
    {
        if (upperCi < benchmark) return -1;
        return lowerCi > benchmark ? 1 : 0;
    }
}