using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.AutoMapper;

public class AutoMapperTests
{
    private readonly Mapper _mapper;

    public AutoMapperTests()
    {
        var profiles = new AutoMapperProfiles();
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile(profiles));
        _mapper = new Mapper(configuration);
    }

    private static HealthDataPoint BuildHealthDataPoint(
        int year,
        string ageBand,
        string sex,
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
        const string expectedAgeBand = "25-31";
        const string expectedSex = "Female";
        const string expectedTrend = "Not yet calculated";
        var expectedDeprivation = new Deprivation
        {
            Value = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England"
        };

        var healthMeasure = new HealthMeasureModelHelper(year: 2007, isAggregate: false)
            .WithAgeDimension(name: expectedAgeBand)
            .WithSexDimension(name: expectedSex)
            .WithDeprivationDimension(new DeprivationDimensionModel
            {
                DeprivationKey = 1,
                Name = "Most deprived decile",
                Sequence = 1,
                Type = "County & UA deprivation deciles in England",
                HasValue = true
            }).Build();

        var expectedHealthData = BuildHealthDataPoint(
            2007, expectedAgeBand, expectedSex, expectedTrend, expectedDeprivation);

        // act
        var actual = _mapper.Map<HealthDataPoint>(healthMeasure);

        // assert
        actual.ShouldBeEquivalentTo(expectedHealthData);
    }

    [Fact]
    public void Mapper_ShouldMapADeprivationDimensionModel_ToADeprivation()
    {
        // Arrange
        var expectedDeprivation = new Deprivation
        {
            Value = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England"
        };

        var deprivationDimension = new DeprivationDimensionModel
        {
            DeprivationKey = 1,
            Name = "Most deprived decile",
            Sequence = 1,
            Type = "County & UA deprivation deciles in England",
            HasValue = true
        };

        // Act
        var actual = _mapper.Map<Deprivation>(deprivationDimension);

        // Assert
        actual.ShouldBeEquivalentTo(expectedDeprivation);
    }
}