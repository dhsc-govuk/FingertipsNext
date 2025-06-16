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
    private readonly Mappings.HealthDataMapper _healthDataMapper;

    private readonly string expectedAreaCode = "Code1";
    private readonly string expectedAreaName = "Area 1";
    private const string expectedAreaGroupCode = "AreaGroupCode";
    private const string expectedAreaGroupName = "AreaGroupName";
    private readonly IndicatorDimensionModel testIndicator = new()
    {
        Name = "Name",
        IndicatorKey = 123,
        IndicatorId = 123,
        BenchmarkComparisonMethod = "Confidence intervals overlapping reference value (95.0)",
        Polarity = "High is good",
        LatestYear = 2024,
    };

    public IndicatorServiceTests()
    {
        _healthDataMapper = new Mappings.HealthDataMapper();
        _healthDataRepository = Substitute.For<IHealthDataRepository>();
        _indicatorService = new IndicatorService(_healthDataRepository, _healthDataMapper);
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
            new object[] { 9, 8, 7, "No Judgement", BenchmarkOutcome.Higher },
        };

    public static IEnumerable<object?[]> BenchmarkMissingValues =>
        new List<object?[]>
        {
            new object?[] { 1, 2, 3, true },
            new object?[] { 1, null, 3, false },
            new object?[] { null, 2, 3, false },
            new object?[] { 1, 2, null, false },
        };

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResult()
    {
        var healthMeasure = new HealthMeasureModelHelper()
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();

        var expectedHealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure) };
        var expected = new HealthDataForArea
        {
            AreaCode = expectedAreaCode,
            AreaName = expectedAreaName,
            HealthData = expectedHealthData,
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns([healthMeasure]);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        result.Content.AreaHealthData.ElementAt(0).ShouldBeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResultLatestDataOnly()
    {
        const string expectedAreaCode2 = "Code2";
        const string expectedAreaName2 = "Area 2";

        var healthMeasure2 = new HealthMeasureModelHelper(year: 2024)
            .WithAreaDimension(expectedAreaCode2, expectedAreaName2)
            .Build();

        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCode2,
                AreaName = expectedAreaName2,
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure2) },
            },
        };
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), Arg.Any<int[]>(), [])
            .Returns(new List<HealthMeasureModel> { healthMeasure2 });

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            [],
            latestOnly: true
        );
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResultForSingleAreaCodeWithMultipleData()
    {
        const string expectedAreaCode2 = "Code2";
        const string expectedAreaName2 = "Area 2";

        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023)
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2024)
            .WithAreaDimension(expectedAreaCode2, expectedAreaName2)
            .Build();
        var healthMeasure3 = new HealthMeasureModelHelper(year: 2020)
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();
        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCode,
                AreaName = expectedAreaName,
                HealthData = new List<HealthDataPoint>
                {
                    _healthDataMapper.Map(healthMeasure1),
                    _healthDataMapper.Map(healthMeasure3),
                },
            },
            new()
            {
                AreaCode = expectedAreaCode2,
                AreaName = expectedAreaName2,
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure2) },
            },
        };
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns(
                new List<HealthMeasureModel> { healthMeasure1, healthMeasure2, healthMeasure3 }
            );

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(2);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
    }

    [Theory]
    [MemberData(nameof(BenchmarkTestData))]
    public async Task GetIndicatorDataShouldReturnExpectedResultForSingleAreaCodeWithBenchmark(
        int lowerCi,
        int upperCi,
        int benchmarkValue,
        string polarity,
        BenchmarkOutcome expectedResult
    )
    {
        var healthMeasure1 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: lowerCi,
            upperCi: upperCi
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(
            year: 2023,
            value: benchmarkValue
        )
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .Build();
        mockHealthData.Add(healthMeasure2);

        testIndicator.Polarity = polarity;
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        var areaDataResult = result.Content.AreaHealthData.ToList();
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        areaDataResult[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaDataResult[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);

        areaDataResult[0]
            .HealthData.First()
            .BenchmarkComparison.ShouldBeEquivalentTo(
                new BenchmarkComparison
                {
                    Outcome = expectedResult,
                    BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
                    BenchmarkAreaName = "Eng",
                    BenchmarkValue = benchmarkValue,
                }
            );
    }

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResultForSingleAreaCodeWhenBenchmarkDataMissing()
    {
        var healthMeasure1 = new HealthMeasureModelHelper(year: 2023, lowerCi: 1, upperCi: 3)
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";
        var healthMeasure2 = new HealthMeasureModelHelper(year: 1974)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .Build();
        healthMeasure2.Value = 2;
        mockHealthData.Add(healthMeasure2);

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count.ShouldBe(1);
        areaDataResult[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaDataResult[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);
        areaDataResult[0].HealthData.First().BenchmarkComparison.ShouldBeEquivalentTo(null);
    }

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResultBenchmarkingInequality()
    {
        const string benchmarkAreaCode = IndicatorService.AreaCodeEngland;
        const string benchmarkAreaName = "Eng";

        var englandDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 40,
            value: 50,
            upperCi: 60
        )
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .Build();

        var englandMaleDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 10,
            value: 20,
            upperCi: 30
        )
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .WithSexDimension(name: "Male", sexIsAggregate: false)
            .Build();

        var englandFemaleDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 10,
            value: 20,
            upperCi: 30
        )
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .WithSexDimension(name: "Female", sexIsAggregate: false)
            .Build();

        var personsDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 70,
            value: 80,
            upperCi: 90
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension()
            .Build();
        var maleDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 10,
            value: 20,
            upperCi: 30
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension(null, name: "Male", sexIsAggregate: false)
            .Build();
        var femaleDataPoint2022 = new HealthMeasureModelHelper(
            year: 2022,
            lowerCi: 300,
            value: 400,
            upperCi: 500
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension(null, name: "Female", sexIsAggregate: false)
            .Build();

        var englandDataPoint2023 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 4,
            value: 5,
            upperCi: 6
        )
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .Build();

        var personsDataPoint2023 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 1,
            value: 2,
            upperCi: 3
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension()
            .Build();
        var maleDataPoint2023 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 2,
            value: 3,
            upperCi: 4
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension(null, name: "Male", sexIsAggregate: false)
            .Build();
        var femaleDataPoint2023 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 3,
            value: 4,
            upperCi: 5
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension(null, name: "Female", sexIsAggregate: false)
            .Build();

        var mockHealthData = new List<HealthMeasureModel>
        {
            englandDataPoint2022,
            personsDataPoint2022,
            maleDataPoint2022,
            femaleDataPoint2022,
            englandDataPoint2023,
            personsDataPoint2023,
            maleDataPoint2023,
            femaleDataPoint2023,
            englandMaleDataPoint2022,
            englandFemaleDataPoint2022,
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode, benchmarkAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        var dataResults = result.Content.AreaHealthData.ToList();
        dataResults.ShouldNotBeEmpty();
        dataResults.Count.ShouldBe(2);

        var areaResults = dataResults.ElementAt(1);
        areaResults.AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaResults.AreaName.ShouldBeEquivalentTo(expectedAreaName);
        areaResults.HealthData.Count().ShouldBe(6);
        var personsResult2022 = areaResults.HealthData.ElementAt(0);
        personsResult2022.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Persons", IsAggregate = true }
        );
        personsResult2022.Year.ShouldBe(2022);
        personsResult2022.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Better,
                BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
                BenchmarkAreaName = "Eng",
                BenchmarkValue = 50,
            }
        );

        var maleResult2022 = areaResults.HealthData.ElementAt(1);
        maleResult2022.Sex.ShouldBeEquivalentTo(new Sex { Value = "Male", IsAggregate = false });
        maleResult2022.Year.ShouldBe(2022);
        maleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Worse,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 80,
            }
        );

        var femaleResult2022 = areaResults.HealthData.ElementAt(2);
        femaleResult2022.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Female", IsAggregate = false }
        );
        femaleResult2022.Year.ShouldBe(2022);
        femaleResult2022.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Better,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 80,
            }
        );

        var personsResult2023 = areaResults.HealthData.ElementAt(3);
        personsResult2023.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Persons", IsAggregate = true }
        );
        personsResult2023.Year.ShouldBe(2023);
        personsResult2023.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Worse,
                BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
                BenchmarkAreaName = "Eng",
                BenchmarkValue = 5,
            }
        );

        var maleResult2023 = areaResults.HealthData.ElementAt(4);
        maleResult2023.Sex.ShouldBeEquivalentTo(new Sex { Value = "Male", IsAggregate = false });
        maleResult2023.Year.ShouldBe(2023);
        maleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Similar,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 2,
            }
        );

        var femaleResult2023 = areaResults.HealthData.ElementAt(5);
        femaleResult2023.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Female", IsAggregate = false }
        );
        femaleResult2023.Year.ShouldBe(2023);
        femaleResult2023.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Better,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 2,
            }
        );

        var engResults = dataResults.ElementAt(0);
        engResults.AreaCode.ShouldBeEquivalentTo(benchmarkAreaCode);
        engResults.AreaName.ShouldBeEquivalentTo(benchmarkAreaName);
        engResults.HealthData.Count().ShouldBe(4);

        var personsEngResult2022 = engResults.HealthData.ElementAt(0);
        personsEngResult2022.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Persons", IsAggregate = true }
        );
        personsEngResult2022.Year.ShouldBe(2022);
        personsEngResult2022.BenchmarkComparison.ShouldBeNull();

        var maleEngResult2022 = engResults.HealthData.ElementAt(2);
        maleEngResult2022.Sex.ShouldBeEquivalentTo(new Sex { Value = "Male", IsAggregate = false });
        maleEngResult2022.Year.ShouldBe(2022);
        maleEngResult2022.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Worse,
                BenchmarkAreaCode = benchmarkAreaCode,
                BenchmarkAreaName = benchmarkAreaName,
                BenchmarkValue = 50,
            }
        );

        var femaleEngResult2022 = engResults.HealthData.ElementAt(3);
        femaleEngResult2022.Sex.ShouldBeEquivalentTo(
            new Sex { Value = "Female", IsAggregate = false }
        );
        femaleEngResult2022.Year.ShouldBe(2022);
        femaleEngResult2022.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Worse,
                BenchmarkAreaCode = benchmarkAreaCode,
                BenchmarkAreaName = benchmarkAreaName,
                BenchmarkValue = 50,
            }
        );
    }

    [Theory]
    [MemberData(nameof(BenchmarkMissingValues))]
    public async Task GetIndicatorDataShouldNotBenchmarkWhenValuesAreMissing(
        int? lowerCi,
        int? benchmarkValue,
        int? upperCi,
        bool shouldBenchmark
    )
    {
        var englandPoint = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 0.125,
            value: 2.25,
            upperCi: 9.78
        )
            .WithAreaDimension(IndicatorService.AreaCodeEngland, "Eng")
            .WithSexDimension()
            .Build();
        var aggregatePoint = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 1,
            value: benchmarkValue,
            upperCi: 3
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension()
            .Build();

        var disAggregatePoint = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: lowerCi,
            value: 3,
            upperCi: upperCi
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithSexDimension(null, name: "Male", sexIsAggregate: false)
            .Build();

        var mockHealthData = new List<HealthMeasureModel>
        {
            englandPoint,
            aggregatePoint,
            disAggregatePoint,
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count.ShouldBe(1);
        if (shouldBenchmark)
        {
            areaDataResult
                .First()
                .HealthData.ElementAt(1)
                .Sex.ShouldBeEquivalentTo(new Sex { Value = "Male", IsAggregate = false });
            areaDataResult
                .First()
                .HealthData.ElementAt(1)
                .BenchmarkComparison.ShouldBeEquivalentTo(
                    new BenchmarkComparison
                    {
                        Outcome = BenchmarkOutcome.Similar,
                        BenchmarkAreaCode = expectedAreaCode,
                        BenchmarkAreaName = expectedAreaName,
                        BenchmarkValue = 2,
                    }
                );
        }
        else
        {
            areaDataResult.First().HealthData.ElementAt(1).BenchmarkComparison.ShouldBeNull();
        }
    }

    [Fact]
    public async Task GetIndicatorDataShouldBenchmarkDeprivations()
    {
        var englandPoint = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 1,
            value: 2,
            upperCi: 3
        )
            .WithAreaDimension(IndicatorService.AreaCodeEngland, "Eng")
            .WithDeprivationDimension()
            .Build();

        var aggregatePoint = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 4,
            value: 5,
            upperCi: 6
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithDeprivationDimension()
            .Build();

        var disAggregatePoint1 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 7,
            value: 8,
            upperCi: 9
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithDeprivationDimension(name: "one", deprivationIsAggregate: false)
            .Build();

        var disAggregatePoint2 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 1,
            value: 3,
            upperCi: 4
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .WithDeprivationDimension(name: "two", deprivationIsAggregate: false)
            .Build();

        var mockHealthData = new List<HealthMeasureModel>
        {
            englandPoint,
            aggregatePoint,
            disAggregatePoint1,
            disAggregatePoint2,
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            "",
            "",
            BenchmarkReferenceType.Unknown,
            [],
            ["Deprivation"]
        );
        var areaDataResult = result.Content.AreaHealthData.ToList();
        areaDataResult.ShouldNotBeEmpty();
        areaDataResult.Count.ShouldBe(1);

        var areasResults = areaDataResult.First().HealthData;
        var aggregatePointResult = areasResults.ElementAt(0);
        aggregatePointResult.Deprivation.ShouldBeEquivalentTo(
            new Deprivation
            {
                Sequence = 1,
                Value = "All",
                Type = "Deprivation Deciles",
                IsAggregate = true,
            }
        );
        aggregatePointResult.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Better,
                BenchmarkAreaCode = IndicatorService.AreaCodeEngland,
                BenchmarkAreaName = "Eng",
                BenchmarkValue = 2,
            }
        );

        var disAggregatePointResult1 = areasResults.ElementAt(1);
        disAggregatePointResult1.Deprivation.ShouldBeEquivalentTo(
            new Deprivation
            {
                Sequence = 1,
                Value = "one",
                Type = "Deprivation Deciles",
                IsAggregate = false,
            }
        );
        disAggregatePointResult1.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Better,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 5,
            }
        );

        var disAggregatePointResult2 = areasResults.ElementAt(2);
        disAggregatePointResult2.Deprivation.ShouldBeEquivalentTo(
            new Deprivation
            {
                Sequence = 1,
                Value = "two",
                Type = "Deprivation Deciles",
                IsAggregate = false,
            }
        );
        disAggregatePointResult2.BenchmarkComparison.ShouldBeEquivalentTo(
            new BenchmarkComparison
            {
                Outcome = BenchmarkOutcome.Worse,
                BenchmarkAreaCode = expectedAreaCode,
                BenchmarkAreaName = expectedAreaName,
                BenchmarkValue = 5,
            }
        );
    }

    public static IEnumerable<object[]> IndicatorTestData =>
        new List<object[]>
        {
            new object[]
            {
                "Foo",
                "High is good",
                IndicatorPolarity.HighIsGood,
                "Confidence intervals overlapping reference value (95.0)",
                BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
            },
            new object[]
            {
                "Bar",
                "Low is good",
                IndicatorPolarity.LowIsGood,
                "Confidence intervals overlapping reference value (99.8)",
                BenchmarkComparisonMethod.CIOverlappingReferenceValue998,
            },
            new object[]
            {
                "Bar",
                "No judgement",
                IndicatorPolarity.NoJudgement,
                "Confidence intervals overlapping reference value (99.8)",
                BenchmarkComparisonMethod.CIOverlappingReferenceValue998,
            },
            new object[]
            {
                "Bar",
                string.Empty,
                IndicatorPolarity.Unknown,
                string.Empty,
                BenchmarkComparisonMethod.Unknown,
            },
            new object[]
            {
                "Foo",
                string.Empty,
                IndicatorPolarity.Unknown,
                "Quintiles",
                BenchmarkComparisonMethod.Quintiles,
            },
        };

    [Theory]
    [MemberData(nameof(IndicatorTestData))]
    public async Task GetIndicatorDataAsyncShouldIncludeIndicatorInfo(
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
            BenchmarkComparisonMethod = testMethod,
        };
        var mockHealthData = new List<HealthMeasureModel>
        {
            new()
            {
                AreaKey = 4,
                AreaDimension = new AreaDimensionModel()
                {
                    Name = "Name",
                    Code = "SomeCode",
                    AreaKey = 4,
                },
                SexDimension = new SexDimensionModel() { Name = string.Empty},
                DeprivationDimension = new DeprivationDimensionModel() { Name = string.Empty, Type = String.Empty },
                AgeDimension = new AgeDimensionModel() { Name = String.Empty },
                IndicatorDimension = new IndicatorDimensionModel() { Name = String.Empty },
                PublishedAt = new DateTime(2025, 1, 1),
                BatchId = "12345_20250101120000"
            },
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(theIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns(mockHealthData);

        _healthDataRepository.GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
            1, Arg.Any<string[]>(),
            [], Arg.Any<string>(), "E92000001").Returns(mockHealthData); ;

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        result.Content.Name.ShouldBe(name);
        result.Content.Polarity.ShouldBeEquivalentTo(expectedPolarity);
        result.Content.BenchmarkMethod.ShouldBeEquivalentTo(expectedMethod);
        result.Status.ShouldBe(ResponseStatus.Success);
    }

    [Fact]
    public async Task GetIndicatorDataAsyncReturnsIndicatorDoesNotExistWhenNoDataFound()
    {
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(Task.FromResult<IndicatorDimensionModel?>(null));
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns([]);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );

        result.Status.ShouldBe(ResponseStatus.IndicatorDoesNotExist);
    }

    [Fact]
    public async Task GetIndicatorDataAsyncReturnsEmptyArrayWhenNoDataFoundButValidIndicatorSelected()
    {
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(
                Task.FromResult<IndicatorDimensionModel?>(
                    new IndicatorDimensionModel() { Name = "Foo" }
                )
            );
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], Arg.Any<string[]>())
            .Returns([]);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );

        result.Status.ShouldBe(ResponseStatus.NoDataForIndicator);
    }

    /// <summary>
    ///  DHSCFT-517
    /// </summary>
    static readonly string[] expectedAreaCodes = ["Code1", "Code2", "Code3", "Code4"];
    static readonly string[] expectedAreaNames = ["Area 1", "Area 2", "Area 3", "Area 4"];

    static readonly HealthMeasureModel healthMeasure0 = new HealthMeasureModelHelper()
        .WithAreaDimension(expectedAreaCodes[0], expectedAreaNames[0])
        .Build();
    static readonly HealthMeasureModel healthMeasure1 = new HealthMeasureModelHelper()
        .WithAreaDimension(expectedAreaCodes[1], expectedAreaNames[1])
        .Build();
    static readonly HealthMeasureModel healthMeasure2 = new HealthMeasureModelHelper()
        .WithAreaDimension(expectedAreaCodes[2], expectedAreaNames[2])
        .Build();
    static readonly HealthMeasureModel healthMeasure3 = new HealthMeasureModelHelper()
        .WithAreaDimension(expectedAreaCodes[3], expectedAreaNames[3])
        .Build();

    [Fact]
    public async Task GetIndicatorDataAsyncReturnsExpectedDataForMultipleAreas()
    {
        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCodes[0],
                AreaName = expectedAreaNames[0],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure0) },
            },
            new()
            {
                AreaCode = expectedAreaCodes[1],
                AreaName = expectedAreaNames[1],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure1) },
            },
            new()
            {
                AreaCode = expectedAreaCodes[2],
                AreaName = expectedAreaNames[2],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure2) },
            },
            new()
            {
                AreaCode = expectedAreaCodes[3],
                AreaName = expectedAreaNames[3],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure3) },
            },
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns([healthMeasure0, healthMeasure1, healthMeasure2, healthMeasure3]);
        _healthDataRepository.GetAreasAsync(Arg.Any<string[]>()).Returns([]);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            expectedAreaCodes,
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );

        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(4);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
        await _healthDataRepository.DidNotReceiveWithAnyArgs().GetAreasAsync([]);
    }

    [Fact]
    public async Task GetIndicatorDataAsyncReturnsExpectedDataForMultipleAreasWhenSomeHaveNoDataAndWhenWeWantEmptyAreaData()
    {
        var expected = new List<HealthDataForArea>
        {
            new()
            {
                AreaCode = expectedAreaCodes[0],
                AreaName = expectedAreaNames[0],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure0) },
            },
            new()
            {
                AreaCode = expectedAreaCodes[1],
                AreaName = expectedAreaNames[1],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure1) },
            },
            new()
            {
                AreaCode = expectedAreaCodes[2],
                AreaName = expectedAreaNames[2],
                HealthData = new List<HealthDataPoint> { _healthDataMapper.Map(healthMeasure2) },
            },
            new() { AreaCode = expectedAreaCodes[3], AreaName = expectedAreaNames[3] },
        };

        var missingAreas = new List<AreaDimensionModel>
        {
            new()
            {
                AreaKey = 3,
                Code = expectedAreaCodes[3],
                Name = expectedAreaNames[3],
            },
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns([healthMeasure0, healthMeasure1, healthMeasure2]);
        _healthDataRepository.GetAreasAsync(Arg.Any<string[]>()).Returns(missingAreas);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            expectedAreaCodes,
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            []
        );
        string[] missingAreasCodes = [missingAreas[0].Code];

        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(4);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
        await _healthDataRepository
            .Received()
            .GetAreasAsync(Arg.Is<string[]>(x => x.SequenceEqual(missingAreasCodes)));
    }

    [Fact]
    public async Task GetIndicatorDataAsyncReturnsDataForAllRequestedAreasWhenNoneHaveData()
    {
        var expected = new List<HealthDataForArea>
        {
            new() { AreaCode = expectedAreaCodes[0], AreaName = expectedAreaNames[0] },
            new() { AreaCode = expectedAreaCodes[1], AreaName = expectedAreaNames[1] },
            new() { AreaCode = expectedAreaCodes[2], AreaName = expectedAreaNames[2] },
            new() { AreaCode = expectedAreaCodes[3], AreaName = expectedAreaNames[3] },
        };

        var missingAreas = new List<AreaDimensionModel>
        {
            new()
            {
                AreaKey = 3,
                Code = expectedAreaCodes[0],
                Name = expectedAreaNames[0],
            },
            new()
            {
                AreaKey = 3,
                Code = expectedAreaCodes[1],
                Name = expectedAreaNames[1],
            },
            new()
            {
                AreaKey = 3,
                Code = expectedAreaCodes[2],
                Name = expectedAreaNames[2],
            },
            new()
            {
                AreaKey = 3,
                Code = expectedAreaCodes[3],
                Name = expectedAreaNames[3],
            },
        };

        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository.GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], []).Returns([]);
        _healthDataRepository.GetAreasAsync(Arg.Any<string[]>()).Returns(missingAreas);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            expectedAreaCodes,
            string.Empty,
            string.Empty,
            BenchmarkReferenceType.Unknown,
            [],
            [],
            true
        );
        string[] missingAreasCodes =
        [
            missingAreas[0].Code,
            missingAreas[1].Code,
            missingAreas[2].Code,
            missingAreas[3].Code,
        ];

        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(4);
        result.Content.AreaHealthData.ShouldBeEquivalentTo(expected);
        await _healthDataRepository
            .Received()
            .GetAreasAsync(Arg.Is<string[]>(x => x.SequenceEqual(missingAreasCodes)));
    }

    [Fact]
    public async Task GetIndicatorDataShouldReturnExpectedResultBenchmarkRefIsAreaGroupForSingleAreaCode()
    {
        var healthMeasure1 = new HealthMeasureModelHelper(
            year: 2023,
            lowerCi: 1,
            upperCi: 10
        )
            .WithAreaDimension(expectedAreaCode, expectedAreaName)
            .Build();

        var mockHealthData = new List<HealthMeasureModel> { healthMeasure1 };

        const string benchmarkAreaCode = expectedAreaGroupCode;
        const string benchmarkAreaName = expectedAreaGroupName;
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2023, value: 5)
            .WithAreaDimension(benchmarkAreaCode, benchmarkAreaName)
            .Build();
        mockHealthData.Add(healthMeasure2);

        testIndicator.Polarity = IndicatorPolarity.HighIsGood.ToString();
        _healthDataRepository
            .GetIndicatorDimensionAsync(1, Arg.Any<string[]>())
            .Returns(testIndicator);
        _healthDataRepository
            .GetIndicatorDataAsync(1, Arg.Any<string[]>(), [], [])
            .Returns(mockHealthData);

        var result = await _indicatorService.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            string.Empty,
            expectedAreaGroupCode,
            BenchmarkReferenceType.SubNational,
            [],
            []
        );
        var areaDataResult = result.Content.AreaHealthData.ToList();
        result.Content.AreaHealthData.ShouldNotBeEmpty();
        result.Content.AreaHealthData.Count().ShouldBe(1);
        areaDataResult[0].AreaCode.ShouldBeEquivalentTo(expectedAreaCode);
        areaDataResult[0].AreaName.ShouldBeEquivalentTo(expectedAreaName);

        areaDataResult[0]
            .HealthData.First()
            .BenchmarkComparison.ShouldBeEquivalentTo(
                new BenchmarkComparison
                {
                    Outcome = BenchmarkOutcome.Similar,
                    BenchmarkAreaCode = expectedAreaGroupCode,
                    BenchmarkAreaName = expectedAreaGroupName,
                    BenchmarkValue = 5,
                }
            );
    }
}
