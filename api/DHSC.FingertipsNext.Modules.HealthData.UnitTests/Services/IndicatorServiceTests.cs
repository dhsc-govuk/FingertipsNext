using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using NSubstitute;
using NSubstitute.Equivalency;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class IndicatorServiceTests
{
    private readonly IHealthDataRepository _healthDataRepository;
    private readonly IndicatorService _indicatorService;
    private readonly Mapper _mapper;

    public IndicatorServiceTests()
    {
        var profiles = new AutoMapperProfiles();
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile(profiles));
        _mapper = new Mapper(configuration);
        _healthDataRepository = Substitute.For<IHealthDataRepository>();
        _indicatorService = new IndicatorService(_healthDataRepository, _mapper);
    }

    public static IEnumerable<object[]> TestData =>
        new List<object[]>
        {
            new object[]
            {
                new[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21" },
                new[] { 20, 21, 22, 23, 24 }.Concat(Enumerable.Range(20, 12)).ToArray(),
                new[] { "age", "sex" },
                new[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray(),
                new[] { "age", "sex" }
            },
            new object[]
            {
                new[]
                {
                    "a10", "a10", "a11", "a11", "a12", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20",
                    "a21"
                },
                Enumerable.Range(20, 12).ToArray(),
                new[] { "age", "sex" },
                new[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray(),
                new[] { "age", "sex" }
            },
            new object[]
            {
                new[] { "area1", "area2", "area1" },
                new[] { 1999, 1999, 1999 },
                new[] { "age", "sex" },
                new[] { "area1", "area2" },
                new[] { 1999 },
                new[] { "age", "sex" }
            },
            new object[]
            {
                new[] { "area1", "area2" },
                new[] { 1999, 2000 },
                new[] { "age", "sex", "age", "sex" },
                new[] { "area1", "area2" },
                new[] { 1999, 2000 },
                new[] { "age", "sex" }
            }
        };

    public static IEnumerable<object[]> BenchmarkTestData =>
        new List<object[]>
        {
            new object[] { 1, 2, 3, IndicatorPolarity.HighIsGood, BenchmarkOutcome.Worse },
            new object[] { 4, 6, 5, IndicatorPolarity.HighIsGood, BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, IndicatorPolarity.HighIsGood, BenchmarkOutcome.Better },
            new object[] { 1, 2, 3, IndicatorPolarity.LowIsGood, BenchmarkOutcome.Better },
            new object[] { 4, 6, 5, IndicatorPolarity.LowIsGood, BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, IndicatorPolarity.LowIsGood, BenchmarkOutcome.Worse },
            new object[] { 1, 2, 3, IndicatorPolarity.NoJudgement, BenchmarkOutcome.Lower },
            new object[] { 4, 6, 5, IndicatorPolarity.NoJudgement, BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, IndicatorPolarity.NoJudgement, BenchmarkOutcome.Higher }
        };

    [Theory]
    [MemberData(nameof(TestData))]
    public async Task GetIndicatorData_PassesFirst10DistinctFiltersToRepository_WhenSuppliedMore(
        string[] inputAreaCodes,
        int[] inputYears,
        string[] inputInequalities,
        string[] expectedAreaCodes,
        int[] expectedYears,
        string[] expectedInequalities)
    {
        await _indicatorService.GetIndicatorDataAsync(
            1,
            inputAreaCodes,
            inputYears,
            inputInequalities,
            BenchmarkComparisonMethod.None
        );

        // expect
        await _healthDataRepository
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo(expectedAreaCodes),
                ArgEx.IsEquivalentTo(expectedYears),
                ArgEx.IsEquivalentTo(expectedInequalities)
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToRepository()
    {
        await _indicatorService.GetIndicatorDataAsync(1, [], [], [], BenchmarkComparisonMethod.None);

        await _healthDataRepository.Received().GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult()
    {
        const string expectedAreaCode = "Code1";
        const string expectedAreaName = "Area 1";

        var healthMeasure = new HealthMeasureModelHelper()
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();

        var expectedHealthData = new List<HealthDataPoint> { _mapper.Map<HealthDataPoint>(healthMeasure) };
        var expected = new HealthDataForArea
        {
            AreaCode = expectedAreaCode,
            AreaName = expectedAreaName,
            HealthData = expectedHealthData
        };

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns([healthMeasure]);

        var result = await _indicatorService.GetIndicatorDataAsync(1, [], [], [], BenchmarkComparisonMethod.None);

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ElementAt(0).ShouldBeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_ForSingleAreaCode_WithMultipleData()
    {
        const string expectedAreaCode1 = "Code1";
        const string expectedAreaName1 = "Area 1";

        const string expectedAreaCode2 = "Code2";
        const string expectedAreaName2 = "Area 2";

        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).Build();
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2024)
            .WithAreaDimension(expectedAreaCode2, expectedAreaName2).Build();
        var healthMeasure3 = new HealthMeasureModelHelper(year: 2020)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).Build();
        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCode1,
                AreaName = expectedAreaName1,
                HealthData = new List<HealthDataPoint>
                {
                    _mapper.Map<HealthDataPoint>(healthMeasure1),
                    _mapper.Map<HealthDataPoint>(healthMeasure3)
                }
            },
            new()
            {
                AreaCode = expectedAreaCode2,
                AreaName = expectedAreaName2,
                HealthData = new List<HealthDataPoint>
                {
                    _mapper.Map<HealthDataPoint>(healthMeasure2)
                }
            }
        };
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(
            new List<HealthMeasureModel>
                { healthMeasure1, healthMeasure2, healthMeasure3 });

        var result = (await _indicatorService.GetIndicatorDataAsync(1, [], [], [], BenchmarkComparisonMethod.None))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(expected);
    }

    [Theory]
    [MemberData(nameof(BenchmarkTestData))]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_ForSingleAreaCode_WithBenchmark(
        int lowerCi,
        int upperCi,
        int benchmarkValue,
        IndicatorPolarity polarity,
        BenchmarkOutcome expectedResult)
    {
        const string expectedAreaCode1 = "Code1";
        const string expectedAreaName1 = "Area 1";


        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023, lowerCi: lowerCi, upperCi: upperCi)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2023)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
        healthMeasure2.Value = benchmarkValue;
        mockHealthData.Add(healthMeasure2);

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(mockHealthData);

        _indicatorService.Polarity = polarity;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode1], [], [],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode1);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName1);
        result[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = expectedResult,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            IndicatorPolarity = polarity
        });
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_ForSingleAreaCode_WhenBenchmarkDataMissing()
    {
        const string expectedAreaCode1 = "Code1";
        const string expectedAreaName1 = "Area 1";


        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023, lowerCi: 1, upperCi: 3)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(year: 1974)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
        healthMeasure2.Value = 2;
        mockHealthData.Add(healthMeasure2);

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(mockHealthData);

        _indicatorService.Polarity = IndicatorPolarity.HighIsGood;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode1], [], [],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode1);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName1);
        result[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(null);
    }
}