using DHSC.FingertipsNext.Modules.Indicators.Services;
using NSubstitute;
using NSubstitute.Equivalency;

namespace DHSC.FingertipsNext.Modules.Indicators.Tests.Services;

public class IndicatorServiceTests
{
    readonly IIndicatorsDataProvider _provider;
    readonly IndicatorService _indicatorService;

    public IndicatorServiceTests()
    {
        _provider = Substitute.For<IIndicatorsDataProvider>();
        _indicatorService = new IndicatorService(_provider);
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
}
