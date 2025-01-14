using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
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
        _mapper = new Mapper(configuration);
        _repository = Substitute.For<IRepository>();
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
    public async Task GetIndicatorData_PassesFirst10DistinctFiltersToRepository_WhenSuppliedMore(string[] inputAreaCodes,
                                                                                           int[] inputYears,
                                                                                           string[] expectedAreaCodes,
                                                                                           int[] expectedYears)
    {
        await _indicatorService.GetIndicatorDataAsync(
            1,
            inputAreaCodes,
            inputYears
        );

        // expect
        await _repository
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo<string[]>(expectedAreaCodes),
                ArgEx.IsEquivalentTo<int[]>(expectedYears)
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToRepository()
    {
        await _indicatorService.GetIndicatorDataAsync(1, [], []);

        await _repository.Received().GetIndicatorDataAsync(1, [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult()
    {
        var healthMeasure = TestHelper.BuildHealthMeasureModel("Code1", 2007, DateTime.Now);
        var expectedHealthData = _mapper.Map<HealthDataPoint>(healthMeasure);
        var expected = new HealthDataForArea
        {
            AreaCode = "Code1",
            HealthData = [expectedHealthData]
        };
        _repository.GetIndicatorDataAsync(1, [], []).Returns([healthMeasure]);


        var result = await _indicatorService.GetIndicatorDataAsync(1, [], []);

        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result.ElementAt(0).Should().BeEquivalentTo(expected);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult_ForSingleAreaCode_WithMultipleData()
    {
        var healthMeasure1 = TestHelper.BuildHealthMeasureModel("Code1", 2023, DateTime.Now);
        var healthMeasure2 = TestHelper.BuildHealthMeasureModel("Code2", 2024, DateTime.Now);
        var healthMeasure3 = TestHelper.BuildHealthMeasureModel("Code1", 2020, DateTime.Now);
        var expected = new HealthDataForArea[]
        {
            new() 
            {
                AreaCode = "Code1",
                HealthData =
                [
                    _mapper.Map<HealthDataPoint>(healthMeasure1),
                    _mapper.Map<HealthDataPoint>(healthMeasure3)
                ]
            },
            new()
            {
                AreaCode = "Code2",
                HealthData = [_mapper.Map<HealthDataPoint>(healthMeasure2) ]  
            }
        };
        _repository.GetIndicatorDataAsync(1, [], []).Returns([healthMeasure1, healthMeasure2, healthMeasure3]);

        var result = await _indicatorService.GetIndicatorDataAsync(1, [], []);

        result.Should().NotBeEmpty();
        result.Should().HaveCount(2);
        result.Should().BeEquivalentTo(expected);
    }
}
