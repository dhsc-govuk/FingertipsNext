using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Mapper;

public class MapperTests
{
    private readonly Mappings.Mapper _mapper = new();

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
            Count = count,
            Value = value,
            LowerConfidenceInterval = lowerConfidenceInterval,
            UpperConfidenceInterval = upperConfidenceInterval,
            AgeBand = ageBand,
            Sex = sex,
            Trend = trend,
            Deprivation = deprivation
        };
    }

    [Fact]
    public void
        Mapper_ShouldMapAHealthMeasure_ToAHealthDataPoint()
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

        var healthMeasure = new HealthMeasureModelHelper(year: 2007, isAggregate: false)
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
        var actual = _mapper.Map(healthMeasure);

        // assert
        actual.ShouldBeEquivalentTo(expectedHealthData);
    }

    [Fact]
    public void Mapper_ShouldMapAnAgeDimensionModel_ToAnAge()
    {
        // Arrange
        var expectedAge = new Age
        {
            Value = "20-25",
            IsAggregate = false
        };

        var ageDimension = new AgeDimensionModel
        {
            Name = "20-25",
            HasValue = true,
            IsAggregate = false
        };

        // Act
        var actual = _mapper.Map(ageDimension);

        // Assert
        actual.ShouldBeEquivalentTo(expectedAge);
    }

    [Fact]
    public void Mapper_ShouldMapASexDimensionModel_ToASex()
    {
        // Arrange
        var expectedSex = new Sex
        {
            Value = "Female",
            IsAggregate = false
        };

        var sexDimension = new SexDimensionModel
        {
            Name = "Female",
            HasValue = true,
            IsAggregate = false
        };

        // Act
        var actual = _mapper.Map(sexDimension);

        // Assert
        actual.ShouldBeEquivalentTo(expectedSex);
    }

    [Fact]
    public void Mapper_ShouldMapADeprivationDimensionModel_ToADeprivation()
    {
        // Arrange
        var expectedDeprivation = new Deprivation
        {
            Value = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England",
            IsAggregate = true
        };

        var deprivationDimension = new DeprivationDimensionModel
        {
            DeprivationKey = 1,
            Name = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England",
            HasValue = true,
            IsAggregate = true
        };

        // Act
        var actual = _mapper.Map(deprivationDimension);

        // Assert
        actual.ShouldBeEquivalentTo(expectedDeprivation);
    }

    [Theory]
    [ InlineData("High is good", IndicatorPolarity.HighIsGood)]
    [ InlineData("Low is good", IndicatorPolarity.LowIsGood)]
    [ InlineData("No judgement", IndicatorPolarity.NoJudgement)]
    [ InlineData(null, IndicatorPolarity.Unknown)]
    
    public void Mapper_ShouldMapAnIndicatorDimensionModelPolarity_ToAnIndicatorPolarity(string modelPolarity, IndicatorPolarity expectedPolarity)
    {
        // Arrange
        var indicator = new IndicatorDimensionModel
            {
                Polarity = modelPolarity
            };

        // Act
        var actual = _mapper.MapIndicatorPolarity(indicator.Polarity);

        // Assert
        actual.ShouldBeEquivalentTo(expectedPolarity);
    }
    
    // TODO: Test Benchmark Mapper
    [Theory]
    [InlineData("Confidence intervals overlapping reference value (95.0)",BenchmarkComparisonMethod.CIOverlappingReferenceValue95)]
    [InlineData("Confidence intervals overlapping reference value (99.8)",BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8)]
    [InlineData("Quintiles",BenchmarkComparisonMethod.Quintiles)]
    [InlineData(null,BenchmarkComparisonMethod.Unknown)]
    public void Mapper_ShouldMapAnIndicatorDimensionModelBenchmarkComparisonMethod_ToABenchmarkComparisonMethod(string modelBenchmarkComparisonMethod, BenchmarkComparisonMethod expectedBenchmarkComparisonMethod)
    {
        // Arrange
        var indicator = new IndicatorDimensionModel
        {
            BenchmarkComparisonMethod = modelBenchmarkComparisonMethod
        };

        // Act
        var actual = _mapper.MapBenchmarkComparisonMethod(indicator.BenchmarkComparisonMethod);

        // Assert
        actual.ShouldBeEquivalentTo(expectedBenchmarkComparisonMethod);
    }
    // TODO: Test Quartiles Mapper
}