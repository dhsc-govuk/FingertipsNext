using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using NSubstitute;
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


        var healthMeasure1 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: lowerCi, upperCi: upperCi, isAggregated: true)
                .WithAreaDimension(expectedAreaCode1, expectedAreaName1).Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2023, isAggregated: true, value: benchmarkValue)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
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
            IndicatorPolarity = polarity,
            BenchmarkValue = benchmarkValue
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

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_BenchmarkingInequality()
    {
        const string expectedAreaCode1 = "Code1";
        const string expectedAreaName1 = "Area 1";

        var personsDataPoint = new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 2, upperCi: 3)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).WithSexDimension().Build();
        var maleDataPoint = new HealthMeasureModelHelper(year: 2023, lowerCi: 2, value: 3, upperCi: 4)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).WithSexDimension(null, "Male").Build();
        var femaleDataPoint = new HealthMeasureModelHelper(year: 2023, lowerCi: 3, value: 4, upperCi: 5)
            .WithAreaDimension(expectedAreaCode1, expectedAreaName1).WithSexDimension(null, "Female").Build();


        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var englandDataPoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 4, value: 5, upperCi: 6)
                .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();

        var mockHealthData = new List<HealthMeasureModel>
            { personsDataPoint, maleDataPoint, femaleDataPoint, englandDataPoint };

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _indicatorService.Polarity = IndicatorPolarity.HighIsGood;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode1], [], ["Sex"],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode1);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName1);
        result[0].HealthData.Count().ShouldBe(3);

        var personsResult = result[0].HealthData.ElementAt(0);
        personsResult.Sex.ShouldBe("sex name");
        personsResult.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 5
        });

        var maleResult = result[0].HealthData.ElementAt(1);
        maleResult.Sex.ShouldBe("Male");
        maleResult.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Similar,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode1,
            BenchmarkAreaName = expectedAreaName1,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 2
        });

        var femaleResult = result[0].HealthData.ElementAt(2);
        femaleResult.Sex.ShouldBe("Female");
        femaleResult.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode1,
            BenchmarkAreaName = expectedAreaName1,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 2
        });
    }
}