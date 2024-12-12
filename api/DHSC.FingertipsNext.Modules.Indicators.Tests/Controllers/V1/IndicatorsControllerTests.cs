using DHSC.FingertipsNext.Modules.Indicators.Controllers.V1;
using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;
using DHSC.FingertipsNext.Modules.Indicators.Services;
using FluentAssertions;
using NSubstitute;
using NSubstitute.Equivalency;

namespace DHSC.FingertipsNext.Modules.Indicators.Tests.Controllers.V1;

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
        await _controller.GetIndicatorData(1, ["ac1", "ac2"], [1999, 2024]);

        // expect
        await _indicatorService
            .Received()
            .GetIndicatorData(
                1,
                ArgEx.IsEquivalentTo<string[]>(["ac1", "ac2"]),
                ArgEx.IsEquivalentTo<int[]>([ 1999, 2024 ])
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToServiceWithDefaults_WhenOptionalParametersNotSpecified()
    {
        await _controller.GetIndicatorData(2);

        // expect
        await _indicatorService.Received().GetIndicatorData(2, [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsArrayFromService_IfServiceReturnsData()
    {
        _indicatorService
            .GetIndicatorData(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<int[]>())
            .Returns(SampleHealthData);
        var healthData = await _controller.GetIndicatorData(3);

        // expect
        healthData.Should().BeEquivalentTo(SampleHealthData);
    }

    private static readonly List<HealthDataForArea> SampleHealthData =
    [
        new()
        {
            AreaCode = "someAreaCode",
            HealthData =
            [
                new HealthDataPoint
                {
                    Count = 1,
                    LowerConfidenceInterval = 2,
                    UpperConfidenceInterval = 3,
                    Value = 4,
                    Year = 5,
                },
            ],
        },
        new()
        {
            AreaCode = "anotherAreaCode",
            HealthData =
            [
                new HealthDataPoint
                {
                    Count = 10,
                    LowerConfidenceInterval = 20,
                    UpperConfidenceInterval = 30,
                    Value = 40,
                    Year = 50,
                },
            ],
        },
    ];
}
