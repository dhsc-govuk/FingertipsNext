using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class Benchmark
{
    public const string LowIsGood = "Low Is Good";

    public const string Rag = "rag";
        
    public static int GetRagCalc(float? lowerCi, float? upperCi, float? benchmark)
    {
        if (upperCi < benchmark) return -1;
        return lowerCi > benchmark ?  1: 0;
    }

    public static IEnumerable<HealthDataForArea> MergeBenchmarkData(IEnumerable<HealthDataForArea> healthDataForArea,
        IEnumerable<HealthDataForArea> healthDataForBenchmark, string comparisonMethod)
    {
        var firstEntry = healthDataForArea.Take(1).FirstOrDefault();
        if (firstEntry == null) return healthDataForArea;
        
        var firstBenchmark = healthDataForBenchmark.Take(1).FirstOrDefault();
        if (firstBenchmark == null) return healthDataForBenchmark;
        
        var areaCode = firstEntry.AreaCode;
        var areaName = firstEntry.AreaName;
        var healthData = firstEntry.HealthData;
        var benchmarkHealthData = firstBenchmark.HealthData;
        var mergedHealthData = healthData.Select(entry =>
        {
            var matchingEntry = benchmarkHealthData.FirstOrDefault(item => item.Year == entry.Year);
            return MergeEntries(entry, matchingEntry, comparisonMethod);
        });
        
        return [new HealthDataForArea
        {
            AreaCode = areaCode,
            AreaName = areaName,
            HealthData = mergedHealthData,
        }];
    }

    public static HealthDataPoint MergeEntries(HealthDataPoint entry, HealthDataPoint? benchmarkEntry, string comparisonMethod)
    {
        var clone = new HealthDataPoint
        {
            Year = entry.Year,
            Count = entry.Count,
            Value = entry.Value,
            LowerConfidenceInterval = entry.LowerConfidenceInterval,
            UpperConfidenceInterval = entry.UpperConfidenceInterval,
            AgeBand = entry.AgeBand,
            Sex = entry.Sex,
        };
        if (benchmarkEntry == null) return clone;

        var polarity = BenchmarkPolarity.LowIsGood;
        var RagValue = GetRagCalc(entry.LowerConfidenceInterval, entry.UpperConfidenceInterval, benchmarkEntry.Value);
        var RagString = BenchmarkPolarity.GetRagString(RagValue, polarity);
        
        clone.Benchmark = new HealthDataPointBenchmark
        {
            Type = comparisonMethod, 
            Value = RagString,
            ComparedTo = benchmarkEntry.Value,
        };
        
        return clone;
    }
}