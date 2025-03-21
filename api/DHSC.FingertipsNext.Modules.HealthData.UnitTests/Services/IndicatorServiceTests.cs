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

    private readonly string expectedAreaCode = "Code1";
    private readonly string expectedAreaName = "Area 1";

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

    public static IEnumerable<object[]> BenchmarkMissingValues => new List<object[]>
    {
        new object[] { 1, 2, 3, true },
        new object[] { 1, null, 3, false },
        new object[] { null, 2, 3, false },
        new object[] { 1, 2, null, false }
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
        const string expectedAreaCode2 = "Code2";
        const string expectedAreaName2 = "Area 2";

        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023)
            .WithAreaDimension(expectedAreaCode, expectedAreaName).Build();
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2024)
            .WithAreaDimension(expectedAreaCode2, expectedAreaName2).Build();
        var healthMeasure3 = new HealthMeasureModelHelper(year: 2020)
            .WithAreaDimension(expectedAreaCode, expectedAreaName).Build();
        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCode,
                AreaName = expectedAreaName,
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
        var healthMeasure1 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: lowerCi, upperCi: upperCi, isAggregate: true)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2023, isAggregate: true, value: benchmarkValue)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
        mockHealthData.Add(healthMeasure2);

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(mockHealthData);

        _indicatorService.Polarity = polarity;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], [], [],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);

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
        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023, lowerCi: 1, upperCi: 3)
            .WithAreaDimension(expectedAreaCode, expectedAreaName).Build();

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
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], [], [],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);
        result[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(null);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_BenchmarkingInequality()
    {
        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        
        var englandDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 40, value: 50, upperCi: 60)
                .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
        
        var personsDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 70, value: 80, upperCi: 90)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension().Build();
        var maleDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 10, value: 20, upperCi: 30, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension(null, "Male").Build();
        var femaleDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 300, value: 400, upperCi: 500, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension(null, "Female").Build();
        
        var englandDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 4, value: 5, upperCi: 6)
                .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();
        
        var personsDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 2, upperCi: 3)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension().Build();
        var maleDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 2, value: 3, upperCi: 4, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension(null, "Male").Build();
        var femaleDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 3, value: 4, upperCi: 5, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension(null, "Female").Build();

        var mockHealthData = new List<HealthMeasureModel>
            {englandDataPoint2022, personsDataPoint2022, maleDataPoint2022, femaleDataPoint2022, englandDataPoint2023, personsDataPoint2023, maleDataPoint2023, femaleDataPoint2023 };

        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _indicatorService.Polarity = IndicatorPolarity.HighIsGood;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], [], ["Sex"],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        result[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);
        result[0].HealthData.Count().ShouldBe(6);

        var personsResult2022 = result[0].HealthData.ElementAt(0);
        personsResult2022.Sex.ShouldBe("sex name");
        personsResult2022.Year.ShouldBe(2022);
        personsResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 50
        });

        var maleResult2022 = result[0].HealthData.ElementAt(1);
        maleResult2022.Sex.ShouldBe("Male");
        maleResult2022.Year.ShouldBe(2022);
        maleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 80
        });

        var femaleResult2022 = result[0].HealthData.ElementAt(2);
        femaleResult2022.Sex.ShouldBe("Female");
        femaleResult2022.Year.ShouldBe(2022);
        femaleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 80
        });
        
        var personsResult2023 = result[0].HealthData.ElementAt(3);
        personsResult2023.Sex.ShouldBe("sex name");
        personsResult2023.Year.ShouldBe(2023);
        personsResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 5
        });

        var maleResult2023 = result[0].HealthData.ElementAt(4);
        maleResult2023.Sex.ShouldBe("Male");
        maleResult2023.Year.ShouldBe(2023);
        maleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Similar,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 2
        });

        var femaleResult2023 = result[0].HealthData.ElementAt(5);
        femaleResult2023.Sex.ShouldBe("Female");
        femaleResult2023.Year.ShouldBe(2023);
        femaleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 2
        });
    }

    [Theory]
    [MemberData(nameof(BenchmarkMissingValues))]
    public async Task GetIndicatorData_ShouldNotBenchmarkWhenValuesAreMissing(
        int? lowerCi,
        int? benchmarkValue,
        int? upperCi,
        bool shouldBenchmark)
    {
        var englandPoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 0.125, value: 2.25, upperCi: 9.78, isAggregate: true)
                .WithAreaDimension(IndicatorService.AreaCodeEngland, "Eng").WithSexDimension().Build();
        var aggregatePoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: benchmarkValue, upperCi: 3, isAggregate: true)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension().Build();

        var disAggregatePoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: lowerCi, value: 3, upperCi: upperCi, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension(null, "Male").Build();

        var mockHealthData = new List<HealthMeasureModel>
            { englandPoint, aggregatePoint, disAggregatePoint };


        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _indicatorService.Polarity = IndicatorPolarity.HighIsGood;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], [], ["Sex"],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        if (shouldBenchmark)
        {
            result.First().HealthData.ElementAt(1).Sex.ShouldBe("Male");
            result.First().HealthData.ElementAt(1).BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Similar,
                Method = BenchmarkComparisonMethod.Rag,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                IndicatorPolarity = IndicatorPolarity.HighIsGood,
                BenchmarkValue = 2
            });
        }
        else
        {
            result.First().HealthData.ElementAt(1).BenchmarkComparison.ShouldBeNull();
        }
    }

    [Fact]
    public async Task GetIndicatorData_ShouldBenchmarkDeprivations()
    {
        var englandPoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 2, upperCi: 3, isAggregate: true)
                .WithAreaDimension(IndicatorService.AreaCodeEngland, "Eng").WithDeprivationDimension().Build();
        
        var aggregatePoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 4, value: 5, upperCi: 6, isAggregate: true)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithDeprivationDimension().Build();

        var disAggregatePoint1 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 7, value: 8, upperCi: 9, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithDeprivationDimension("one").Build();
        
        var disAggregatePoint2 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 3, upperCi: 4, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithDeprivationDimension("two").Build();

        var mockHealthData = new List<HealthMeasureModel>
            { englandPoint, aggregatePoint, disAggregatePoint1, disAggregatePoint2 };


        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _indicatorService.Polarity = IndicatorPolarity.HighIsGood;
        var result =
            (await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], [], ["Deprivation"],
                BenchmarkComparisonMethod.Rag))
            .ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        var areasResults = result.First().HealthData;
        var aggregatePointResult = areasResults.ElementAt(0);
        aggregatePointResult.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "All",
            Type = "Deprivation Deciles",
        });
        aggregatePointResult.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 2
        });
        
        var disAggregatePointResult1 = areasResults.ElementAt(1);
        disAggregatePointResult1.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "one",
            Type = "Deprivation Deciles",
        });
        disAggregatePointResult1.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 5
        });
        
        var disAggregatePointResult2 = areasResults.ElementAt(2);
        disAggregatePointResult2.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "two",
            Type = "Deprivation Deciles",
        });
        disAggregatePointResult2.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            Method = BenchmarkComparisonMethod.Rag,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            IndicatorPolarity = IndicatorPolarity.HighIsGood,
            BenchmarkValue = 5
        });
    }
}