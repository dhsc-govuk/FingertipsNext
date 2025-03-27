using TrendAnalysisApp.Repository;
using TrendAnalysisApp.SearchData;
using NSubstitute;
using Shouldly;
using Newtonsoft.Json.Linq;

namespace TrendAnalysisApp.UnitTests;

public class TrendDataProcessorTests
{
    private readonly IIndicatorRepository _mockRepository;
    private readonly IIndicatorJsonFileHelper _mockFileHelper;
    private readonly TrendDataProcessor _trendDataProcessor;

    public TrendDataProcessorTests()
    {
        _mockRepository = Substitute.For<IIndicatorRepository>();
        _mockFileHelper = Substitute.For<IIndicatorJsonFileHelper>();

        // If time, consider adding tests for the full Process method
        _trendDataProcessor = new TrendDataProcessor(_mockRepository, _mockFileHelper);
    }

    [Theory]
    [InlineData(1, 29, 2)]
    [InlineData(2, 1, 2)] // Indicator 2 uses the default dimensions
    [InlineData(4, 23, 2)]
    [InlineData(19, 1, 1)] // Indicator 19 is female-only
    public void TestGetDefaultSearchDimsForIndicatorReturnsCorrectDimensions(
        short indicatorId,
        short expectedAgeDim,
        byte expectedSexDim
    ) {
        var result = TrendDataProcessor.GetDefaultSearchDimsForIndicator(indicatorId);
        result.AgeDimensionKey.ShouldBe(expectedAgeDim);
        result.SexDimensionKey.ShouldBe(expectedSexDim);
    }

    [Fact]
    public void TestUpdateIndicatorSearchDataWritesCorrectDataToFile() {
        const string expectedFilePath = "SearchData/assets/indicators.json";
        JArray expectedUpdatedFileContents = new()
        {   
            { new JObject { ["indicatorID"] = 1 } },
            { new JObject { ["indicatorID"] = 2, ["trendsByArea"] = new JArray {
                new JObject {
                    ["areaCode"] = "ABCAreaCode",
                    ["trend"] = "Increasing and getting worse"
                }}}
            }
        };

        _mockFileHelper.Read(expectedFilePath).Returns(
            new JArray { { new JObject { ["indicatorID"] = 1 } }, { new JObject { ["indicatorID"] = 2 } } }
        );
        var mockIndicatorDataForSearch = new IndicatorTrendDataForSearch
        {
            IndicatorId = 2,
        };
        mockIndicatorDataForSearch.AreaToTrendList.Add(
            new AreaWithTrendData("ABCAreaCode", "Increasing and getting worse")
        );
        var mockPerIndicatorData = new List<IndicatorTrendDataForSearch> {mockIndicatorDataForSearch};

        _trendDataProcessor.UpdateIndicatorSearchData(mockPerIndicatorData);

        _mockFileHelper.Received().Read(expectedFilePath);
        _mockFileHelper.Received().Write(
            expectedFilePath,
            Arg.Is<JArray>(ja => JToken.DeepEquals(ja, expectedUpdatedFileContents))
        );
    }
}
