﻿using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Mapper;

public class HealthDataMapperTests
{
    private readonly Mappings.HealthDataMapper _healthDataMapper = new();

    private static HealthDataPoint BuildHealthDataPoint(
        int year,
        Age ageBand,
        Sex sex,
        string trend,
        Deprivation deprivation,
        float count = 1,
        float value = 1,
        float lowerConfidenceInterval = 1,
        float upperConfidenceInterval = 1
    )
    {
        return new HealthDataPoint
        {
            Year = year,
            DatePeriod = new DatePeriod { From = new DateOnly(year, 1, 1), To = new DateOnly(year, 12, 31), PeriodType = DatePeriodType.Calendar },
            Count = count,
            Value = value,
            LowerConfidenceInterval = lowerConfidenceInterval,
            UpperConfidenceInterval = upperConfidenceInterval,
            AgeBand = ageBand,
            Sex = sex,
            ReportingPeriod = ReportingPeriod.Yearly,
            Trend = trend,
            Deprivation = deprivation
        };
    }

    [Fact]
    public void
        MapperShouldMapAHealthMeasureToAHealthDataPoint()
    {
        // arrange
        var expectedAgeBand = new Age
        {
            Value = "25-31",
            IsAggregate = false
        };
        var expectedSex = new Sex
        {
            Value = "Female",
            IsAggregate = false
        };
        const string expectedTrend = "Not yet calculated";
        var expectedDeprivation = new Deprivation
        {
            Value = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England",
            IsAggregate = false
        };

        var healthMeasure = new HealthMeasureModelHelper(year: 2007)
            .WithAgeDimension(new AgeDimensionModel
            {
                Name = "25-31",
                IsAggregate = false
            })
            .WithSexDimension(new SexDimensionModel
            {
                Name = "Female",
                IsAggregate = false
            })
            .WithDeprivationDimension(new DeprivationDimensionModel
            {
                DeprivationKey = 1,
                Name = "Most deprived decile",
                Sequence = 1,
                Type = "County & UA deprivation deciles in England",
                HasValue = true,
                IsAggregate = false
            }).Build();

        var expectedHealthData = BuildHealthDataPoint(
            2007, expectedAgeBand, expectedSex, expectedTrend, expectedDeprivation);

        // act
        var actual = _healthDataMapper.Map(healthMeasure);

        // assert
        actual.ShouldBeEquivalentTo(expectedHealthData);
    }

    [Theory]
    [InlineData("High is good", IndicatorPolarity.HighIsGood)]
    [InlineData("Low is good", IndicatorPolarity.LowIsGood)]
    [InlineData("No judgement", IndicatorPolarity.NoJudgement)]
    [InlineData(null, IndicatorPolarity.Unknown)]

    public void MapperShouldMapAnIndicatorDimensionModelPolarityToAnIndicatorPolarity(string? modelPolarity, IndicatorPolarity expectedPolarity)
    {
        // Act
        var actual = _healthDataMapper.MapIndicatorPolarity(modelPolarity);

        // Assert
        actual.ShouldBeEquivalentTo(expectedPolarity);
    }

    [Theory]
    [InlineData("Confidence intervals overlapping reference value (95.0)", BenchmarkComparisonMethod.CIOverlappingReferenceValue95)]
    [InlineData("Confidence intervals overlapping reference value (99.8)", BenchmarkComparisonMethod.CIOverlappingReferenceValue998)]
    [InlineData("Quintiles", BenchmarkComparisonMethod.Quintiles)]
    [InlineData(null, BenchmarkComparisonMethod.Unknown)]
    public void MapperShouldMapAnIndicatorDimensionModelBenchmarkComparisonMethodToABenchmarkComparisonMethod(string? modelBenchmarkComparisonMethod, BenchmarkComparisonMethod expectedBenchmarkComparisonMethod)
    {
        // Act
        var actual = _healthDataMapper.MapBenchmarkComparisonMethod(modelBenchmarkComparisonMethod);

        // Assert
        actual.ShouldBeEquivalentTo(expectedBenchmarkComparisonMethod);
    }

    [Fact]
    public void ShouldMapQuarterlyCollectionFrequency() => _healthDataMapper.MapCollectionFrequency("Quarterly").ShouldBeEquivalentTo(CollectionFrequency.Quarterly);

    [Fact]
    public void ShouldMapAnnualCollectionFrequency() =>
        _healthDataMapper.MapCollectionFrequency("annually").ShouldBeEquivalentTo(CollectionFrequency.Annually);

    [Fact]
    public void ShouldMapAnnualCollectionFrequencyAsDefault() =>
        _healthDataMapper.MapCollectionFrequency("blah").ShouldBeEquivalentTo(CollectionFrequency.Annually);

    [Fact]
    public void ShouldMapAnnualCollectionFrequencyAsDefaultForNull() =>
        _healthDataMapper.MapCollectionFrequency(null).ShouldBeEquivalentTo(CollectionFrequency.Annually);

    [Fact]
    public void ShouldMapMonthlyCollectionFrequency() =>
        _healthDataMapper.MapCollectionFrequency("MONTHLY").ShouldBeEquivalentTo(CollectionFrequency.Monthly);

    [Fact]
    public void MapperShouldMapQuartileDataModelToIndicatorQuartileData()
    {
        // Arrange
        var mockQuartileData = new List<QuartileDataModel>
        {
            new()
            {
                IndicatorId = 0,
                AgeName = "All ages",
                IsAgeAggregatedOrSingle = true,
                SexName = "Persons",
                IsSexAggregatedOrSingle = true,
                Polarity = "High is good",
                Year = 2024,
                FromDate = new DateTime(2024, 1, 1),
                ToDate = new DateTime(2024, 12, 31),
                PeriodType = "Calendar",
                CollectionFrequency = "Yearly",
                ReportingPeriod = "yearly",
                Q0Value = 10,
                Q1Value = 20,
                Q2Value = 30,
                Q3Value = 40,
                Q4Value = 50,
                AreaValue = 100,
                AncestorValue = 200,
                EnglandValue = 300
            }
        };

        var expectedQuartileData = new List<IndicatorQuartileData>
        {
            new IndicatorQuartileData()
            {
                IndicatorId = 0,
                Polarity = IndicatorPolarity.HighIsGood,
                Age = new Age { Value = "All ages", IsAggregate = true },
                Sex = new Sex { Value = "Persons", IsAggregate = true },
                ReportingPeriod = ReportingPeriod.Yearly,
                IsAggregate = true,
                Year = 2024,
                DatePeriod =  new DatePeriod { From = new DateOnly(2024, 1, 1), To = new DateOnly(2024, 12, 31), PeriodType = DatePeriodType.Calendar },
                Q0Value = 10,
                Q1Value = 20,
                Q2Value = 30,
                Q3Value = 40,
                Q4Value = 50,
                AreaValue = 100,
                AncestorValue = 200,
                EnglandValue = 300
            }
        };

        // Act
        var actual = _healthDataMapper.Map(mockQuartileData);

        // Assert
        actual.ShouldBeEquivalentTo(expectedQuartileData);
    }
}
