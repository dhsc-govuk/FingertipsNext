using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class Benchmark(HealthDataForArea benchmarkData, string polarity)
{
    public const string Rag = "rag";

    private HealthDataForArea _benchmarkData { get; } = benchmarkData;
    private string _polarity { get; } = polarity;

    public IEnumerable<HealthDataForArea> EnrichHealthDataForMultipleAreas(IEnumerable<HealthDataForArea> allAreaData)
    {
        return allAreaData.Select(EnrichHealthDataForArea);
    }

    private HealthDataForArea EnrichHealthDataForArea(HealthDataForArea areaData)
    {
        areaData.HealthData = areaData.HealthData.Select(EnrichHealthPoint);
        return areaData;
    }

    private HealthDataPoint EnrichHealthPoint(HealthDataPoint dataPoint)
    {
        var benchmarkPoint = GetBenchMarkYear(dataPoint.Year);
        if (benchmarkPoint == null) return dataPoint;

        var ragValue = GetRagCalc(dataPoint.LowerConfidenceInterval, dataPoint.UpperConfidenceInterval,
            benchmarkPoint.Value);
        var ragString = BenchmarkPolarity.GetRagString(ragValue, _polarity);
        dataPoint.Benchmark = new HealthDataPointBenchmark { Type = Rag, Value = ragString };
        return dataPoint;
    }

    private HealthDataPoint? GetBenchMarkYear(int year)
    {
        return _benchmarkData.HealthData.FirstOrDefault(item => item.Year == year);
    }

    private static int GetRagCalc(float? lowerCi, float? upperCi, float? benchmark)
    {
        if (upperCi < benchmark) return -1;
        return lowerCi > benchmark ? 1 : 0;
    }
}