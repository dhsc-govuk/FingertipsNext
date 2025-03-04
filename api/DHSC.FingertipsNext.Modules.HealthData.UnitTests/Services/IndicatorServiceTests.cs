﻿using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;
using NSubstitute;
using NSubstitute.Equivalency;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Services;

public class IndicatorServiceTests
{
    readonly IHealthDataRepository _healthDataRepository;
    readonly Mapper _mapper;
    readonly IndicatorService _indicatorService;

    public IndicatorServiceTests()
    {
        var profiles = new AutoMapperProfiles();
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile(profiles));
        _mapper = new Mapper(configuration);
        _healthDataRepository = Substitute.For<IHealthDataRepository>();
        _indicatorService = new IndicatorService(_healthDataRepository, _mapper);
    }

    public static IEnumerable<object[]> TestData =>
        new List<object[]>
        {
            new object[]
            {
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21" },
                new int[] { 20, 21, 22, 23, 24}.Concat(Enumerable.Range(20, 12)).ToArray(),
                new string[] { "age", "sex" },
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray(),
                new string[] { "age", "sex" }
            },
            new object[]
            {
                new string[] { "a10", "a10", "a11", "a11", "a12", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19", "a20", "a21" },
                Enumerable.Range(20, 12).ToArray(),
                new string[] { "age", "sex" },
                new string[] { "a10", "a11", "a12", "a13", "a14", "a15", "a16", "a17", "a18", "a19" },
                Enumerable.Range(20, 10).ToArray(),
                new string[] { "age", "sex" },
            },
            new object[]
            {
                new string[] {"area1", "area2", "area1" },
                new int[] { 1999, 1999, 1999},
                new string[] {"age", "sex" },
                new string[] { "area1", "area2" },
                new int[] { 1999 },
                new string[] { "age", "sex" }
            },
            new object[]
            {
                new string[] {"area1", "area2" },
                new int[] { 1999, 2000 },
                new string[] {"age", "sex", "age", "sex" },
                new string[] { "area1", "area2" },
                new int[] { 1999, 2000 },
                new string[] { "age", "sex" }
            }
        };

    [Theory]
    [MemberData(nameof(TestData))]
    public async Task GetIndicatorData_PassesFirst10DistinctFiltersToRepository_WhenSuppliedMore(string[] inputAreaCodes,
                                                                                           int[] inputYears,
                                                                                           string[] inputInequalities,
                                                                                           string[] expectedAreaCodes,
                                                                                           int[] expectedYears,
                                                                                           string[] expectedInequalities)
    {
        await _indicatorService.GetIndicatorDataAsync(
            1,
            inputAreaCodes,
            inputYears,
            inputInequalities
        );

        // expect
        await _healthDataRepository
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo(expectedAreaCodes),
                ArgEx.IsEquivalentTo(expectedYears),
                ArgEx.IsEquivalentTo(expectedInequalities)
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToRepository()
    {
        await _indicatorService.GetIndicatorDataAsync(1, [], [], []);

        await _healthDataRepository.Received().GetIndicatorDataAsync(1, [], [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ShouldReturnExpectedResult()
    {
        const string expectedAreaCode = "Code1";
        const string expectedAreaName = "Area 1";

        var healthMeasure = new HealthMeasureModelHelper()
            .WithAreaDimension(code: expectedAreaCode, name:(expectedAreaName))
            .Build();

        var expectedHealthData = new List<HealthDataPoint>() { _mapper.Map<HealthDataPoint>(healthMeasure) };
        var expected = new HealthDataForArea()
        {
            AreaCode = expectedAreaCode,
            AreaName = expectedAreaName,
            HealthData = expectedHealthData
        };

        _healthDataRepository.GetIndicatorDataAsync(1, [], [], []).Returns([healthMeasure]);

        var result = await _indicatorService.GetIndicatorDataAsync(1, [], [], []);

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
            .WithAreaDimension(code: expectedAreaCode1, name: expectedAreaName1).Build();
        var healthMeasure2 = new HealthMeasureModelHelper(year: 2024)
            .WithAreaDimension(code: expectedAreaCode2, name: expectedAreaName2).Build();
        var healthMeasure3 = new HealthMeasureModelHelper(year: 2020)
            .WithAreaDimension(code: expectedAreaCode1, name: expectedAreaName1).Build();
        var expected = new List<HealthDataForArea>()
        {
            new()
            {
                AreaCode = expectedAreaCode1,
                AreaName = expectedAreaName1,
                HealthData = new List<HealthDataPoint>()
                {
                    _mapper.Map<HealthDataPoint>(healthMeasure1),
                    _mapper.Map<HealthDataPoint>(healthMeasure3)
                }
            },
            new()
            {
                AreaCode = expectedAreaCode2,
                AreaName = expectedAreaName2,
                HealthData = new List<HealthDataPoint>()
                {
                    _mapper.Map<HealthDataPoint>(healthMeasure2)
                }
            }
        };
        _healthDataRepository.GetIndicatorDataAsync(1, [], [], []).Returns(
            (IEnumerable<HealthMeasureModel>)new List<HealthMeasureModel>()
                { healthMeasure1, healthMeasure2, healthMeasure3 });

        var result = (await _indicatorService.GetIndicatorDataAsync(1, [], [], [])).ToList();

        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(expected);
    }
}