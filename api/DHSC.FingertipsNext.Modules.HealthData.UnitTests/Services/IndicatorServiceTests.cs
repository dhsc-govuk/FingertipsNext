using AutoMapper;
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
    readonly IIndicatorsDataProvider _provider;
    readonly IRepository _repository;
    readonly IMapper _mapper;
    readonly IndicatorService _indicatorService;

    public IndicatorServiceTests()
    {
        _provider = Substitute.For<IIndicatorsDataProvider>();
        _repository = Substitute.For<IRepository>();
        _mapper = Substitute.For<IMapper>();
        _indicatorService = new IndicatorService(_provider, _repository, _mapper);
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToProvider()
    {
        await _indicatorService.GetIndicatorData(1, [], []);

        // expect
        _provider.Received().GetIndicatorData(1, [], []);
    }

    [Fact]
    public async Task GetIndicatorData_PassesOnly10FiltersToProvider_WhenSuppliedMore()
    {
        await _indicatorService.GetIndicatorData(
            1,
            ["a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21"],
            Enumerable.Range(20, 12).ToArray()
        );

        // expect
        _provider
            .Received()
            .GetIndicatorData(
                1,
                ArgEx.IsEquivalentTo<string[]>(["a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19"]),
                ArgEx.IsEquivalentTo<int[]>(Enumerable.Range(20, 10).ToArray())
            );
    }

    [Fact]
    public async Task GetIndicatorData_PassesDistinctFiltersToProvider_WhenSuppliedDuplicates()
    {
        await _indicatorService.GetIndicatorData(
            1,
            ["area1", "area2", "area1"],
            [1999, 1999, 1999]
        );

        // expect
        _provider
            .Received()
            .GetIndicatorData(
                1,
                ArgEx.IsEquivalentTo<string[]>(["area1", "area2"]),
                ArgEx.IsEquivalentTo<int[]>([1999])
            );
    }

    [Fact]
    public void GetIndicatorData_DelegatesToRepository()
    {
        _indicatorService.GetIndicatorData_(1, [], []);

        _repository.Received().GetIndicatorData(1, [], []);
    }

    [Fact]
    public void GetIndicatorData_ShouldReturnExpectedResult()
    {
        var areaDimension = new AreaDimensionDto
        {
            AreaKey = 1,
            Code = "Code",
            Name = "Name",
            StartDate = DateTime.Now,
            EndDate = DateTime.Now,
        };
        var indicatorDimension = new IndicatorDimensionDto
        {
            IndicatorKey = 1,
            Name = "Name",
            IndicatorId = 1,
            StartDate = DateTime.Now,
            EndDate = DateTime.Now,
        };
        var sexDimension = new SexDimensionDto
        {
            SexKey = 1,
            Name = "Name",
            IsFemale = true,
            HasValue = true,
            SexId = 1,
        };
        var ageDimension = new AgeDimensionDto
        {
            AgeKey = 1,
            AgeId = 1,
            Name = "Name"
        };
        var healthMeasure = new HealthMeasureDto
        {
            HealthMeasureKey = 1,
            Count = 1.0,
            Value = 1.0,
            LowerCi = 1.0,
            UpperCi = 1.0,
            Year = 2007,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension
        };

        _mapper.Map<IEnumerable<HealthMeasureDto>>(Arg.Any<IEnumerable<HealthMeasure>>())
               .Returns([healthMeasure]);
        _repository.GetIndicatorData(1, [], []).Returns([]);

        var result = _indicatorService.GetIndicatorData_(1, [], []);

        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result.ElementAt(0).Should().BeEquivalentTo(healthMeasure);
    }
}
