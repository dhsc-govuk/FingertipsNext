using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using FluentAssertions;
using FluentAssertions.Equivalency.Steps;
using NSubstitute;
using Shouldly;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class BenchmarkComparisonEngineTests
{

    [Fact]
    public void BenchmarkComparisonEngineTestBasicBenchmarkingHighIsGood()
    {
        HealthDataForArea benchmarkHealthData = HealthDataForAreaBuilder.WithSexSegments(areaCode: "E92000001", spread: 1.1, persons: [1, 2, 3, 4], null, null);
        HealthDataForArea targetArea = HealthDataForAreaBuilder.WithSexSegments(areaCode: "TARGET", spread: 1.1, persons: [4, 3, 2, 1], null, null);

        var results = BenchmarkComparisonEngine.PerformAreaBenchmarking(
            [targetArea], benchmarkHealthData, IndicatorPolarity.HighIsGood
            ).ToList();
        var comparisons = results[0].IndicatorSegments.First().HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison)
            .ToList();

        comparisons[0].Outcome.ShouldBe(BenchmarkOutcome.Better);
        comparisons[1].Outcome.ShouldBe(BenchmarkOutcome.Similar);
        comparisons[2].Outcome.ShouldBe(BenchmarkOutcome.Similar);
        comparisons[3].Outcome.ShouldBe(BenchmarkOutcome.Worse);

        comparisons[0].BenchmarkAreaCode.ShouldBe("E92000001");
        comparisons[0].BenchmarkValue.ShouldBe(1);
    }
    [Fact]
    public void BenchmarkComparisonEngineTestBasicBenchmarkingLowIsGood()
    {
        HealthDataForArea benchmarkHealthData = HealthDataForAreaBuilder.WithSexSegments(areaCode: "E92000001", spread: 1.1, persons: [1, 2, 3, 4], null, null);
        HealthDataForArea targetArea = HealthDataForAreaBuilder.WithSexSegments(areaCode: "TARGET", spread: 1.1, persons: [4, 3, 2, 1], null, null);

        var results = BenchmarkComparisonEngine.PerformAreaBenchmarking(
            [targetArea], benchmarkHealthData, IndicatorPolarity.LowIsGood
            ).ToList();

        var outcomes = results[0].IndicatorSegments.First().HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison.Outcome)
            .ToList();

        outcomes[0].ShouldBe(BenchmarkOutcome.Worse);
        outcomes[1].ShouldBe(BenchmarkOutcome.Similar);
        outcomes[2].ShouldBe(BenchmarkOutcome.Similar);
        outcomes[3].ShouldBe(BenchmarkOutcome.Better);
    }

    [Fact]
    public void BenchmarkComparisonEngineTestBasicBenchmarkingNoJudgement()
    {
        HealthDataForArea benchmarkHealthData = HealthDataForAreaBuilder.WithSexSegments(areaCode: "E92000001", spread: 1.1, persons: [1, 2, 3, 4], null, null);
        HealthDataForArea targetArea = HealthDataForAreaBuilder.WithSexSegments(areaCode: "TARGET", spread: 1.1, persons: [4, 3, 2, 1], null, null);

        var results = BenchmarkComparisonEngine.PerformAreaBenchmarking(
            [targetArea], benchmarkHealthData, IndicatorPolarity.NoJudgement
            ).ToList();
        var outcomes = results[0].IndicatorSegments.First().HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison.Outcome)
            .ToList();

        outcomes[0].ShouldBe(BenchmarkOutcome.Higher);
        outcomes[1].ShouldBe(BenchmarkOutcome.Similar);
        outcomes[2].ShouldBe(BenchmarkOutcome.Similar);
        outcomes[3].ShouldBe(BenchmarkOutcome.Lower);
    }

    [Fact]
    public void BenchmarkComparisonEngineTestInequalityBenchmarking()
    {
        HealthDataForArea targetArea = HealthDataForAreaBuilder.WithSexSegments(areaCode: "TARGET", spread: 1.1, persons: [4, 3, 2, 1], male: [1, 2, 3, 4], female: [2, 3, 4, 5]);

        var results = BenchmarkComparisonEngine.PerformInequalityBenchmarking(
            [targetArea], IndicatorPolarity.NoJudgement
            ).ToList();

        var benchmarks = results[0].IndicatorSegments
            .First(seg => seg.Sex.Value == "Persons")
            .HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison)
            .ToList();

        benchmarks[0].ShouldBe(null);
        benchmarks[1].ShouldBe(null);
        benchmarks[2].ShouldBe(null);
        benchmarks[3].ShouldBe(null);


        benchmarks = results[0].IndicatorSegments
            .First(seg => seg.Sex.Value == "Female")
            .HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison)
            .ToList();

        benchmarks[0].BenchmarkAreaCode.ShouldBe("TARGET");
        benchmarks[0].BenchmarkValue.ShouldBe(4);

        benchmarks[0].Outcome.ShouldBe(BenchmarkOutcome.Lower);
        benchmarks[1].Outcome.ShouldBe(BenchmarkOutcome.Similar);
        benchmarks[2].Outcome.ShouldBe(BenchmarkOutcome.Higher);
        benchmarks[3].Outcome.ShouldBe(BenchmarkOutcome.Higher);



        benchmarks = results[0].IndicatorSegments
            .First(seg => seg.Sex.Value == "Male")
            .HealthData.ToList()
            .Select(hd => hd.BenchmarkComparison)
            .ToList();

        benchmarks[0].BenchmarkAreaCode.ShouldBe("TARGET");
        benchmarks[0].BenchmarkValue.ShouldBe(4);

        benchmarks[0].Outcome.ShouldBe(BenchmarkOutcome.Lower);
        benchmarks[1].Outcome.ShouldBe(BenchmarkOutcome.Similar);
        benchmarks[2].Outcome.ShouldBe(BenchmarkOutcome.Similar);
        benchmarks[3].Outcome.ShouldBe(BenchmarkOutcome.Higher);
    }
}

