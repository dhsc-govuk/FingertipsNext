﻿using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.AutoMapper;

public class AutoMapperTests
{
    readonly Mapper _mapper;
    public AutoMapperTests() {
        var profiles = new AutoMapperProfiles();
        var configuration = new MapperConfiguration(cfg => cfg.AddProfile(profiles));
        _mapper = new Mapper(configuration);
    }

    private static HealthDataPoint BuildHealthDataPoint(
        int year,
        string ageBand,
        string sex,
        string trend,
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
            Trend = trend
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

        var healthMeasure = new HealthMeasureModelHelper(year: 2007)
            .WithAgeDimension(name: expectedAgeBand).WithSexDimension(name: expectedSex).Build();
        
        var expectedHealthData = BuildHealthDataPoint(
            year: 2007, ageBand:expectedAgeBand, sex: expectedSex, trend: expectedTrend);

        // act
        var actual = _mapper.Map<HealthDataPoint>(healthMeasure);

        // assert
        actual.ShouldBeEquivalentTo(expectedHealthData);
    }
}
