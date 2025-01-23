using AutoMapper;
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

    [Fact]
    public void
        Mapper_ShouldMapAHeathMeasure_ToAHealthDataPoint()
    {
        // arrange
        var healthMeasure = TestHelper.BuildHealthMeasureModel("Code1", 2007, DateTime.Now);
        var expectedHealthData = TestHelper.BuildHealthDataPoint(
            2007, "Name", "Name");

        // act
        var actual = _mapper.Map<HealthDataPoint>(healthMeasure);

        // assert
        actual.ShouldBeEquivalentTo(expectedHealthData);

    }
}
