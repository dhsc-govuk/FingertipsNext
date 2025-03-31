using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using NSubstitute;
using Shouldly;
using BenchmarkComparison = DHSC.FingertipsNext.Modules.HealthData.Schemas.BenchmarkComparison;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class IndicatorServiceTests
{
    private readonly IHealthDataRepository _healthDataRepository;
    private readonly IndicatorService _indicatorService;
    private readonly Mapper _mapper;

    private readonly string expectedAreaCode = "Code1";
    private readonly string expectedAreaName = "Area 1";
    private IndicatorDimensionModel testIndicator = new IndicatorDimensionModel()
    {
        Name = "Name",
        IndicatorKey = 123,
        IndicatorId = 123,
        StartDate = DateTime.Today,
        EndDate = DateTime.Today,
        BenchmarkComparisonMethod = "Confidence intervals overlapping reference value (95.0)",
        Polarity = "High is good",
    };

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
            new object[] { 1, 2, 3, "High is good", BenchmarkOutcome.Worse },
            new object[] { 4, 6, 5, "High is good", BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, "High is good", BenchmarkOutcome.Better },
            new object[] { 1, 2, 3, "Low is good", BenchmarkOutcome.Better },
            new object[] { 4, 6, 5, "Low is good", BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, "Low is good", BenchmarkOutcome.Worse },
            new object[] { 1, 2, 3, "No Judgement", BenchmarkOutcome.Lower },
            new object[] { 4, 6, 5, "No Judgement", BenchmarkOutcome.Similar },
            new object[] { 9, 8, 7, "No Judgement", BenchmarkOutcome.Higher }
        };

    public static IEnumerable<object[]> BenchmarkMissingValues => new List<object[]>
    {
        new object[] { 1, 2, 3, true },
        new object[] { 1, null, 3, false },
        new object[] { null, 2, 3, false },
        new object[] { 1, 2, null, false }
    };

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

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns([healthMeasure]);

        var result = await _indicatorService.GetIndicatorDataAsync(1, [], "", [], []);
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        result.Content.AreaHealthData.ElementAt(0).ShouldBeEquivalentTo(expected);
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
        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(
            new List<HealthMeasureModel>
                { healthMeasure1, healthMeasure2, healthMeasure3 });

        var result = (await _indicatorService.GetIndicatorDataAsync(1, [], "", [], []));
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(2);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
    }

    [Theory]
    [MemberData(nameof(BenchmarkTestData))]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_ForSingleAreaCode_WithBenchmark(
        int lowerCi,
        int upperCi,
        int benchmarkValue,
        string polarity,
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

        testIndicator.Polarity = polarity;
        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], []);
        var areaDataResult = result.Content.AreaHealthData.ToList();
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        areaDataResult[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaDataResult[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);

        areaDataResult[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = expectedResult,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
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

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], []);
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count().ShouldBe(1);
        areaDataResult[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaDataResult[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);
        areaDataResult[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(null);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_BenchmarkingInequality()
    {
        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";

        var englandDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 40, value: 50, upperCi: 60)
                .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();

        var englandMaleDataPoint2022 = new HealthMeasureModelHelper(year: 2022, lowerCi: 10, value: 20, upperCi: 30, isAggregate: false)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .WithSexDimension(name:  "Male", sexIsAggregate: false)
            .Build();

        var englandFemaleDataPoint2022 = new HealthMeasureModelHelper(year: 2022, lowerCi: 10, value: 20, upperCi: 30, isAggregate: false)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .WithSexDimension(name: "Female", sexIsAggregate: false)
            .Build();

        var personsDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 70, value: 80, upperCi: 90)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension().Build();
        var maleDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 10, value: 20, upperCi: 30, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithSexDimension(null, name: "Male", sexIsAggregate: false)
                .Build();
        var femaleDataPoint2022 =
            new HealthMeasureModelHelper(year: 2022, lowerCi: 300, value: 400, upperCi: 500, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithSexDimension(null, name: "Female", sexIsAggregate: false)
                .Build();

        var englandDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 4, value: 5, upperCi: 6)
                .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName).Build();

        var personsDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 2, upperCi: 3)
                .WithAreaDimension(expectedAreaCode, expectedAreaName).WithSexDimension().Build();
        var maleDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 2, value: 3, upperCi: 4, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithSexDimension(null, name: "Male", sexIsAggregate: false)
                .Build();
        var femaleDataPoint2023 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 3, value: 4, upperCi: 5, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithSexDimension(null, name: "Female", sexIsAggregate: false)
                .Build();

        var mockHealthData = new List<HealthMeasureModel>
            {
                englandDataPoint2022,
                personsDataPoint2022, maleDataPoint2022, femaleDataPoint2022,
                englandDataPoint2023, personsDataPoint2023, maleDataPoint2023, femaleDataPoint2023,
                englandMaleDataPoint2022, englandFemaleDataPoint2022
            };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode, benchmarkAreaCode], "", [], ["Sex"]);
        var dataResults = result.Content.AreaHealthData.ToList();
        dataResults.ShouldNotBeEmpty();
        dataResults.Count().ShouldBe(2);

        var areaResults = dataResults.ElementAt(1);
        areaResults.AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaResults.AreaName.ShouldBeEquivalentTo(expectedAreaName);
        areaResults.HealthData.Count().ShouldBe(6);
        
        var personsResult2022 = areaResults.HealthData.ElementAt(0);
        personsResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Persons",
            IsAggregate = true
        });
        personsResult2022.Year.ShouldBe(2022);
        personsResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            BenchmarkValue = 50
        });

        var maleResult2022 = areaResults.HealthData.ElementAt(1);
        maleResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Male",
            IsAggregate = false
        });
        maleResult2022.Year.ShouldBe(2022);
        maleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 80
        });

        var femaleResult2022 = areaResults.HealthData.ElementAt(2);
        femaleResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Female",
            IsAggregate = false
        });
        femaleResult2022.Year.ShouldBe(2022);
        femaleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 80
        });

        var personsResult2023 = areaResults.HealthData.ElementAt(3);
        personsResult2023.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Persons",
            IsAggregate = true
        });
        personsResult2023.Year.ShouldBe(2023);
        personsResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            BenchmarkValue = 5
        });

        var maleResult2023 = areaResults.HealthData.ElementAt(4);
        maleResult2023.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Male",
            IsAggregate = false
        });
        maleResult2023.Year.ShouldBe(2023);
        maleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Similar,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 2
        });

        var femaleResult2023 = areaResults.HealthData.ElementAt(5);
        femaleResult2023.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Female",
            IsAggregate = false
        });
        femaleResult2023.Year.ShouldBe(2023);
        femaleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 2
        });

        var engResults = dataResults.ElementAt(0);
        engResults.AreaCode.ShouldBeEquivalentTo(benchmarkAreaCode);
        engResults.AreaName.ShouldBeEquivalentTo(benchmarkAreaName);
        engResults.HealthData.Count().ShouldBe(4);

        var personsEngResult2022 = engResults.HealthData.ElementAt(0);
        personsEngResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Persons",
            IsAggregate = true
        });
        personsEngResult2022.Year.ShouldBe(2022);
        personsEngResult2022.BenchmarkComparison.ShouldBeNull();

        var maleEngResult2022 = engResults.HealthData.ElementAt(2);
        maleEngResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Male",
            IsAggregate = false
        });
        maleEngResult2022.Year.ShouldBe(2022);
        maleEngResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            BenchmarkAreaCode = benchmarkAreaCode,
            BenchmarkAreaName = benchmarkAreaName,
            BenchmarkValue = 50
        });

        var femaleEngResult2022 = engResults.HealthData.ElementAt(3);
        femaleEngResult2022.Sex.ShouldBeEquivalentTo(new Sex
        {
            Value = "Female",
            IsAggregate = false
        });
        femaleEngResult2022.Year.ShouldBe(2022);
        femaleEngResult2022.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            BenchmarkAreaCode = benchmarkAreaCode,
            BenchmarkAreaName = benchmarkAreaName,
            BenchmarkValue = 50
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
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithSexDimension(null, name: "Male", sexIsAggregate: false)
                .Build();

        var mockHealthData = new List<HealthMeasureModel>
            { englandPoint, aggregatePoint, disAggregatePoint };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], ["Sex"]);
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count().ShouldBe(1);
        if (shouldBenchmark)
        {
            areaDataResult.First().HealthData.ElementAt(1).Sex.ShouldBeEquivalentTo(new Sex
            {
                Value = "Male",
                IsAggregate = false
            });
            areaDataResult.First().HealthData.ElementAt(1).BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Similar,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 2
            });
        }
        else
        {
            areaDataResult.First().HealthData.ElementAt(1).BenchmarkComparison.ShouldBeNull();
        }
    }

    [Fact]
    public async Task GetIndicatorData_ShouldBenchmarkDeprivations()
    {
        var englandPoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 2, upperCi: 3, isAggregate: true)
                .WithAreaDimension(IndicatorService.AreaCodeEngland, "Eng")
                .WithDeprivationDimension()
                .Build();

        var aggregatePoint =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 4, value: 5, upperCi: 6, isAggregate: true)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithDeprivationDimension()
                .Build();

        var disAggregatePoint1 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 7, value: 8, upperCi: 9, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithDeprivationDimension(name: "one", deprivationIsAggregate: false)
                .Build();

        var disAggregatePoint2 =
            new HealthMeasureModelHelper(year: 2023, lowerCi: 1, value: 3, upperCi: 4, isAggregate: false)
                .WithAreaDimension(expectedAreaCode, expectedAreaName)
                .WithDeprivationDimension(name: "two", deprivationIsAggregate: false)
                .Build();

        var mockHealthData = new List<HealthMeasureModel>
            { englandPoint, aggregatePoint, disAggregatePoint1, disAggregatePoint2 };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], ["Deprivation"]);
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count().ShouldBe(1);

        var areasResults = areaDataResult.First().HealthData;
        var aggregatePointResult = areasResults.ElementAt(0);
        aggregatePointResult.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "All",
            Type = "Deprivation Deciles",
            IsAggregate = true
        });
        aggregatePointResult.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
            BenchmarkAreaName = "Eng",
            BenchmarkValue = 2
        });

        var disAggregatePointResult1 = areasResults.ElementAt(1);
        disAggregatePointResult1.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "one",
            Type = "Deprivation Deciles",
            IsAggregate = false
        });
        disAggregatePointResult1.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Better,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 5
        });

        var disAggregatePointResult2 = areasResults.ElementAt(2);
        disAggregatePointResult2.Deprivation.ShouldBeEquivalentTo(new Deprivation
        {
            Sequence = 1,
            Value = "two",
            Type = "Deprivation Deciles",
            IsAggregate = false
        });
        disAggregatePointResult2.BenchmarkComparison.ShouldBeEquivalentTo(new BenchmarkComparison
        {
            Outcome = BenchmarkOutcome.Worse,
            BenchmarkAreaCode = expectedAreaCode,
            BenchmarkAreaName = expectedAreaName,
            BenchmarkValue = 5
        });
    }

    public static IEnumerable<object[]> IndicatorTestData => new List<object[]>
    {
        new object[] { "Foo", "High is good", IndicatorPolarity.HighIsGood, "Confidence intervals overlapping reference value (95.0)", BenchmarkComparisonMethod.CIOverlappingReferenceValue95  },
        new object[] { "Bar", "Low is good", IndicatorPolarity.LowIsGood, "Confidence intervals overlapping reference value (99.8)", BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8  },
        new object[] { "Bar", "No judgement", IndicatorPolarity.NoJudgement, "Confidence intervals overlapping reference value (99.8)", BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8  },
        new object[] { "Bar", "", IndicatorPolarity.Unknown, "", BenchmarkComparisonMethod.Unknown },
        new object[] { "Foo", "High is good", IndicatorPolarity.HighIsGood, "Confidence intervals overlapping reference value (95.0)", BenchmarkComparisonMethod.CIOverlappingReferenceValue95  },
        new object[] { "Foo", "", IndicatorPolarity.Unknown, "Quintiles", BenchmarkComparisonMethod.Quintiles  },
    };

    [Theory]
    [MemberData(nameof(IndicatorTestData))]
    public async Task GetIndicatorDataAsync_ShouldIncludeIndicatorInfo(
        string name,
        string testPolarity,
        IndicatorPolarity expectedPolarity,
        string testMethod,
        BenchmarkComparisonMethod expectedMethod
        )
    {
        var theIndicator = new IndicatorDimensionModel()
        {
            Name = name,
            Polarity = testPolarity,
            BenchmarkComparisonMethod = testMethod
        };
        var mockHealthData = new List<HealthMeasureModel>
            { new HealthMeasureModel()
                {
                    AreaKey = 4,
                    AreaDimension = new AreaDimensionModel()
                    {
                        Name = "Name",
                        Code = "SomeCode",
                        AreaKey = 4,
                    }
                }
            };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(theIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(),
                [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _healthDataRepository.GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
            1, Arg.Any<string[]>(),
            [], Arg.Any<string>()).Returns(mockHealthData);;

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], []);
        result.Content.Name.ShouldBe(name);
        result.Content.Polarity.ShouldBeEquivalentTo(expectedPolarity);
        result.Content.BenchmarkMethod.ShouldBeEquivalentTo(expectedMethod);
        result.Status.ShouldBe(ResponseStatus.Success);
    }

    [Fact]
    public async Task GetIndicatorDataAsync_ReturnsIndicatorDoesNotExist_WhenNoDataFound()
    {
        var mockHealthData = new List<HealthMeasureModel>
            {  };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(Task.FromResult<IndicatorDimensionModel>(null));
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], []);

        result.Status.ShouldBe(ResponseStatus.IndicatorDoesNotExist);
    }

    [Fact]
    public async Task GetIndicatorDataAsync_ReturnsEmptyArray_WhenNoDataFoundButValidIndicatorSelected()
    {
        var mockHealthData = new List<HealthMeasureModel>
            {  };

        _healthDataRepository.GetIndicatorDimensionAsync(1).Returns(Task.FromResult<IndicatorDimensionModel>(new IndicatorDimensionModel() { Name = "Foo" }));
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result =
            await _indicatorService.GetIndicatorDataAsync(1, [expectedAreaCode], "", [], []);

        result.Status.ShouldBe(ResponseStatus.NoDataForIndicator);
    }
}