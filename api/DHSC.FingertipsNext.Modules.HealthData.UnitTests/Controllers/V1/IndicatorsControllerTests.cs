using DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using NSubstitute.Equivalency;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Controllers.V1;

public class IndicatorControllerTests
{
    private static readonly IndicatorWithHealthDataForAreas SampleHealthData = new IndicatorWithHealthDataForAreas
    {
        Name = "A nice indicator",
        AreaHealthData =
        [
            new()
            {
                AreaCode = "AreaCode1",
                HealthData =
                [
                    new HealthDataPoint
                    {
                        Year = 2023,
                        Count = 1,
                        Value = 1,
                        LowerConfidenceInterval = 1.1111f,
                        UpperConfidenceInterval = 2.2222f,
                        AgeBand = "Sample Age Band",
                        Sex = "Sample Sex",
                        Trend = "Sample Trend",
                        Deprivation = new Deprivation
                        {
                            Sequence = 1,
                            Value = "Most deprived decile",
                            Type = "County & UA deprivation deciles in England",
                        }
                    }
                ]
            }
        ]
    };

    private readonly IndicatorsController _controller;
    private readonly IIndicatorsService _indicatorService;

    public IndicatorControllerTests()
    {
        _indicatorService = Substitute.For<IIndicatorsService>();
        _controller = new IndicatorsController(_indicatorService);
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToService_WhenAllParametersSpecified()
    {
        await _controller.GetIndicatorDataAsync(1, ["ac1", "ac2"], "someAreaType", [1999, 2024], ["age", "sex"]);

        // expect
        await _indicatorService
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo<string[]>(["ac1", "ac2"]),
                "someAreaType",
                ArgEx.IsEquivalentTo<int[]>([1999, 2024]),
                ArgEx.IsEquivalentTo<string[]>(["age", "sex"])
            );
    }

    [Fact]
    public async Task GetIndicatorData_DelegatesToServiceWithDefaults_WhenOptionalParametersNotSpecified()
    {
        await _controller.GetIndicatorDataAsync(2);

        // expect
        await _indicatorService.Received().GetIndicatorDataAsync(2, [], "", [], []);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsOkResponse_IfServiceReturnsData()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.Success)
            {
                Content = SampleHealthData
            });

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(200);
        response?.Value.ShouldBeEquivalentTo(SampleHealthData);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsSuccessResponse_IfServiceReturnsEmptyArray()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.NoDataForIndicator));

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(200);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsNotFoundResponse_IfIndicatorDoesNotExist()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.IndicatorDoesNotExist));

        var response = await _controller.GetIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(404);
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsBadResponse_WhenMoreThan10YearsSupplied()
    {
        var response = await _controller.GetIndicatorDataAsync(3, ["areaCode1"], "",
            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) as BadRequestObjectResult;

        response?.StatusCode.ShouldBe(400);
        (response?.Value as SimpleError)?.Message.Contains("Too many values supplied for parameter years").ShouldBeTrue();
    }

    [Fact]
    public async Task GetIndicatorData_ReturnsBadResponse_WhenMoreThan10CodesSupplied()
    {
        var response = await _controller.GetIndicatorDataAsync(3,
            ["areaCode1", "ac2", "ac3", "ac4", "ac5", "ac6", "ac7", "ac8", "ac9", "ac10", "ac11"], "",
            [1]) as BadRequestObjectResult;

        response?.StatusCode.ShouldBe(400);
        (response?.Value as SimpleError)?.Message.Contains("Too many values supplied for parameter area_codes").ShouldBeTrue();
    }
}