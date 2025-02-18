using DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Shouldly;
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
                ArgEx.IsEquivalentTo<int[]>([1999, 2024]),
                []
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToServiceWithDefaults_WhenOptionalParametersNotSpecified()
    {
        await _controller.GetIndicatorDataAsync(2);

        // expect
        await _indicatorService.Received().GetIndicatorDataAsync(2, [], [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsOkResponse_IfServiceReturnsData()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(SampleHealthData);

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.Equals(200);
        response?.Value.ShouldBeEquivalentTo(SampleHealthData);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsNotFoundResponse_IfServiceReturnsEmptyArray()
    {
        _indicatorService
           .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<int[]>(), Arg.Any<string[]>())
           .Returns([]);

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(404);
    }

    private static readonly List<HealthDataForArea> SampleHealthData =
    [
        new()
        {
            AreaCode = "AreaCode1",
            HealthData =
            [
                new()
                {
                    Year = 2023,
                    Count = 1,
                    Value = 1,
                    LowerConfidenceInterval = 1.1111f,
                    UpperConfidenceInterval = 2.2222f,
                    AgeBand = "Sample Age Band",
                    Sex = "Sample Sex"
                }
            ]
        }
    ];
}
