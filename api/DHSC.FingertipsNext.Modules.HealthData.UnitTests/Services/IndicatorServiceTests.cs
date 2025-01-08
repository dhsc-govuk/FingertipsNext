using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using FluentAssertions;
using NSubstitute;
using NSubstitute.Equivalency;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class IndicatorServiceTests
{
    readonly IRepository _repository;
    readonly Mapper _mapper;
    readonly IndicatorService _indicatorService;

    public IndicatorServiceTests()
    {
        var profiles = new AutoMapperProfiles();
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile(profiles));
        _repository = Substitute.For<IRepository>();
        _mapper = new Mapper(configuration);
        _indicatorService = new IndicatorService(_repository, _mapper);
    }

    public static IEnumerable<object[]> TestData =>
        new List<object[]>
        {
            new object[]
            {
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21" },
                new int[] { 20, 21, 22, 23, 24}.Concat(Enumerable.Range(20, 12)).ToArray(),
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray()
            },
            new object[]
            {
                new string[] { "a10", "a10", "a11", "a11", "a12", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21" },
                Enumerable.Range(20, 12).ToArray(),
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray()
            },
            new object[]
            {
                new string[] {"area1", "area2", "area1" },
                new int[] { 1999, 1999, 1999},
                new string[] { "area1", "area2" },
                new int[] { 1999 }
            }
        };

    [Theory]
    [MemberData(nameof(TestData))]
    public void GetIndicatorData_PassesFirst10DistinctFiltersToRepository_WhenSuppliedMore(string[] inputAreaCodes,
                                                                                           int[] inputYears,
                                                                                           string[] expectedAreaCodes,
                                                                                           int[] expectedYears)
    {
        _indicatorService.GetIndicatorData(
            1,
            inputAreaCodes,
            inputYears
        );

        // expect
        _repository
            .Received()
            .GetIndicatorData(
                1,
                ArgEx.IsEquivalentTo<string[]>(expectedAreaCodes),
                ArgEx.IsEquivalentTo<int[]>(expectedYears)
            );
    }

    [Fact]
    public void GetIndicatorData_DelegatesToRepository()
    {
        _indicatorService.GetIndicatorData(1, [], []);

        _repository.Received().GetIndicatorData(1, [], []);
    }

    [Fact]
    public void GetIndicatorData_ShouldReturnExpectedResult()
    {
        var areaDimension = new AreaDimensionModel
        {
            AreaKey = 1,
            Code = "Code",
            Name = "Name",
            StartDate = DateTime.Now,
            EndDate = DateTime.Now,
        };
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            Name = "Name",
            IndicatorId = 1,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now,
        };
        var sexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Name",
            IsFemale = true,
            HasValue = true,
            SexId = 1,
        };
        var ageDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            AgeID = 1,
            Name = "Name"
        };
        var healthMeasure = new HealthMeasureModel
        {
            HealthMeasureKey = 1,
            Count = 1.0,
            Value = 1.0,
            LowerCI = 1.0,
            UpperCI = 1.0,
            Year = 2007,
            AreaKey = 1,
            AgeKey = 1,
            IndicatorKey = 1,
            SexKey = 1,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension
        };

        _repository.GetIndicatorData(1, [], []).Returns([healthMeasure]);
        var mappingResult = _mapper.Map<HealthMeasure>(healthMeasure);

        var result = _indicatorService.GetIndicatorData(1, [], []);

        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result.ElementAt(0).Should().BeEquivalentTo(mappingResult);
    }
}
