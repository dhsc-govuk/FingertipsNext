using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Controllers.V1;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
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
                        DatePeriod = new DatePeriod
                        {
                            PeriodType = DatePeriodType.Calendar,
                            From = new DateOnly(2023, 1, 1),
                            To = new DateOnly(2023, 12, 31)
                        },
                        Count = 1,
                        Value = 1,
                        LowerConfidenceInterval = 1.1111f,
                        UpperConfidenceInterval = 2.2222f,
                        AgeBand = new Age
                        {
                            Value = "4-5",
                            IsAggregate = false
                        },
                        Sex = new Sex
                        {
                            Value = "Persons",
                            IsAggregate = true
                        },
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
    public async Task GetIndicatorDataDelegatesToServiceWhenAllParametersSpecified()
    {
        await _controller.GetPublishedIndicatorDataAsync(1, ["ac1", "ac2"], "someAreaType", years: [1999, 2024], inequalities: ["age", "sex"]);

        // expect
        await _indicatorService
            .Received()
            .GetIndicatorDataAsync(
                1,
                ArgEx.IsEquivalentTo<string[]>(["ac1", "ac2"]),
                "someAreaType",
                "",
                BenchmarkReferenceType.Unknown,
                years: ArgEx.IsEquivalentTo<int[]>([1999, 2024]),
                inequalities: ArgEx.IsEquivalentTo<string[]>(["age", "sex"])
            );
    }

    [Fact]
    public async Task GetIndicatorDataDelegatesToServiceWithDefaultsWhenOptionalParametersNotSpecified()
    {
        await _controller.GetPublishedIndicatorDataAsync(2);

        // expect
        await _indicatorService.Received().GetIndicatorDataAsync(2, [], "", "", BenchmarkReferenceType.Unknown, [], []);
    }

    [Fact]
    public async Task GetIndicatorDataReturnsOkResponseIfServiceReturnsData()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<BenchmarkReferenceType>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.Success)
            {
                Content = SampleHealthData
            });

        var response = await _controller.GetPublishedIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(200);
        response?.Value.ShouldBeEquivalentTo(SampleHealthData);
    }

    [Fact]
    public async Task GetIndicatorDataReturnsSuccessResponseIfServiceReturnsEmptyArray()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<BenchmarkReferenceType>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.NoDataForIndicator));

        var response = await _controller.GetPublishedIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(200);
    }

    [Fact]
    public async Task GetIndicatorDataReturnsNotFoundResponseIfIndicatorDoesNotExist()
    {
        _indicatorService
            .GetIndicatorDataAsync(Arg.Any<int>(), Arg.Any<string[]>(), Arg.Any<string>(), Arg.Any<string>(), Arg.Any<BenchmarkReferenceType>(), Arg.Any<int[]>(), Arg.Any<string[]>())
            .Returns(new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.IndicatorDoesNotExist));

        var response = await _controller.GetPublishedIndicatorDataAsync(3) as ObjectResult;

        // expect
        response?.StatusCode.ShouldBe(404);
    }

    [Fact]
    public async Task GetIndicatorDataReturnsBadResponseWhenMoreThan10YearsSupplied()
    {
        var response = await _controller.GetPublishedIndicatorDataAsync(3, ["areaCode1"], "",
            years: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]) as BadRequestObjectResult;

        response?.StatusCode.ShouldBe(400);
        (response?.Value as SimpleError)?.Message.Contains("Too many values supplied for parameter years", StringComparison.Ordinal).ShouldBeTrue();
    }

    [Fact]
    public async Task GetIndicatorDataReturnsBadResponseWhenMoreThan10CodesSupplied()
    {
        var response = await _controller.GetPublishedIndicatorDataAsync(3,
            ["areaCode1", "ac2", "ac3", "ac4", "ac5", "ac6", "ac7", "ac8", "ac9", "ac10", "ac11"], "",
            years: [1]) as BadRequestObjectResult;

        response?.StatusCode.ShouldBe(400);
        (response?.Value as SimpleError)?.Message.Contains("Too many values supplied for parameter area_codes", StringComparison.Ordinal).ShouldBeTrue();
    }

    [Fact]
    public async Task GetIndicatorDataReturnsBadResponseWhenAncestorCodeMissing()
    {
        var response = await _controller.GetPublishedIndicatorDataAsync(
            indicatorId: 3,
            areaCodes: ["areaCode1"],
            areaType: "",
            ancestorCode: "",
            benchmarkRefType: BenchmarkReferenceType.SubNational,
            years: [1]) as BadRequestObjectResult;

        response?.StatusCode.ShouldBe(400);
        (response?.Value as SimpleError)?.Message.Contains("Missing parameter 'ancestor_code'. When benchmark_ref_type is set to SubNational then the ancestor_code parameter must be set", StringComparison.Ordinal).ShouldBeTrue();
    }
}