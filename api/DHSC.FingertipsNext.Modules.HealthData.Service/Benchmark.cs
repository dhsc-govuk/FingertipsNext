using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class Benchmark
{
    public const string Rag = "rag";

    protected Benchmark()
    {
    }

    private static int GetRagCalc(float? lowerCi, float? upperCi, float? benchmark)
    {
        if (upperCi < benchmark) return -1;
        return lowerCi > benchmark ? 1 : 0;
    }

    public static HealthDataForArea MergeBenchmarkData(HealthDataForArea areaData,
        HealthDataForArea benchmarkData, string comparisonMethod, string polarity)
    {
        var areaCode = areaData.AreaCode;

        // don't benchmark it against itself!
        if (areaCode == benchmarkData.AreaCode) return areaData;

        var areaName = areaData.AreaName;
        var healthData = areaData.HealthData;
        var benchmarkHealthData = benchmarkData.HealthData;

        // this could be slow if significant amounts of data are encountered
        var mergedHealthData = healthData.Select(entry =>
        {
            var matchingEntry = benchmarkHealthData.FirstOrDefault(item => item.Year == entry.Year);
            return matchingEntry == null ? entry : MergeEntries(entry, matchingEntry, comparisonMethod, polarity);
        });

        return new HealthDataForArea
        {
            AreaCode = areaCode,
            AreaName = areaName,
            HealthData = mergedHealthData
        };
    }

    private static HealthDataPoint MergeEntries(HealthDataPoint entry, HealthDataPoint benchmarkEntry,
        string comparisonMethod, string polarity)
    {
        var clone = new HealthDataPoint
        {
            Year = entry.Year,
            Count = entry.Count,
            Value = entry.Value,
            LowerConfidenceInterval = entry.LowerConfidenceInterval,
            UpperConfidenceInterval = entry.UpperConfidenceInterval,
            AgeBand = entry.AgeBand,
            Sex = entry.Sex
        };

        var ragValue = GetRagCalc(entry.LowerConfidenceInterval, entry.UpperConfidenceInterval, benchmarkEntry.Value);
        var ragString = BenchmarkPolarity.GetRagString(ragValue, polarity);

        clone.Benchmark = new HealthDataPointBenchmark
        {
            Type = comparisonMethod,
            Value = ragString,
            ComparedTo = benchmarkEntry.Value
        };

        return clone;
    }
}