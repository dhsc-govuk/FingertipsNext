using DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using FluentAssertions;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.Equivalency;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Controllers.V1;

public class IndicatorControllerTests
{
    private readonly IIndicatorsService _indicatorService;
    private readonly IndicatorsController _controller;

    public IndicatorControllerTests()
    {
        _indicatorService = Substitute.For<IIndicatorsService>();
        _controller = new IndicatorsController(_indicatorService);
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToService_WhenAllParametersSpecified()
    {
        await _controller.GetIndicatorDataAsync(1, ["ac1", "ac2"], [1999, 2024]);

        // expect
        await _indicatorService
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo<string[]>(["ac1", "ac2"]),
                ArgEx.IsEquivalentTo<int[]>([ 1999, 2024 ])
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToServiceWithDefaults_WhenOptionalParametersNotSpecified()
    {
        await _controller.GetIndicatorDataAsync(2);

        // expect
        await _indicatorService.Received().GetIndicatorDataAsync(2, [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsOkResponse_IfServiceReturnsData()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<int[]>())
            .Returns(SampleHealthData);

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.Equals(200);
        response?.Value.Should().BeEquivalentTo(SampleHealthData);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsNotFoundResponse_IfServiceReturnsEmptyArray()
    {
        _indicatorService
           .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<int[]>())
           .Returns([]);

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.Equals(404);
    }

    private static readonly List<HealthMeasure> SampleHealthData =
    [
        new()
        {
            HealthMeasureKey = 1,
            Count = 1.0,
            Value = 1.0,
            LowerCI = 1.0,
            UpperCI = 1.0,
            Year = 2007,
            AreaDimension = new()
            {
                AreaKey = 1,
                Code = "Code",
                Name = "Name",
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
            },
            AgeDimension = new()
            {
                AgeKey = 1,
                AgeId = 1,
                Name = "Name"
            },
            IndicatorDimension = new()
            {
                IndicatorKey = 1,
                Name = "Name",
                IndicatorId = 1,
                StartDate = DateTime.Now,
                EndDate = DateTime.Now,
            },
            SexDimension = new()
            {
                SexKey = 1,
                Name = "Name",
                IsFemale = true,
                HasValue = true,
                SexId = 1,
            }
        }
    ];
}
