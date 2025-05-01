using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Repository;
using TrendAnalysisApp.SearchData;
using NSubstitute;
using Shouldly;
using Newtonsoft.Json.Linq;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;
using TrendAnalysisApp.UnitTests.Helpers;

namespace TrendAnalysisApp.UnitTests;

public class TrendDataProcessorTests
{
    private readonly IIndicatorJsonFileHelper _mockFileHelper;
    private readonly TrendDataProcessor _trendDataProcessor;
    private readonly ServiceProvider _serviceProvider;
    private readonly HealthMeasureDbContext _dbContext;
    private readonly HealthMeasureRepository _healthDataRepository;

    public TrendDataProcessorTests()
    {
        _mockFileHelper = Substitute.For<IIndicatorJsonFileHelper>();

        // use inMemoryDb for testing rather than mocking the context based on HealthMeasureRepository tests in API 
        var inMemoryDbGuid = Guid.NewGuid().ToString();
        var dbOptions = new DbContextOptionsBuilder().UseInMemoryDatabase(
             inMemoryDbGuid
        );
        _dbContext = new HealthMeasureDbContext(dbOptions.Options);
        _healthDataRepository = new HealthMeasureRepository(_dbContext);
        
        var indicatorRepository = new IndicatorRepository(_dbContext);
        
        // init TrendProcessor with repository that uses inMemoryDb 
        _trendDataProcessor = new TrendDataProcessor(indicatorRepository, _mockFileHelper);
        // initialise the serviceProvider using inMemoryDb (based on Program.cs) with minium subset of services
        _serviceProvider = new ServiceCollection()
            .AddDbContext<HealthMeasureDbContext>(
            options => options.UseInMemoryDatabase(inMemoryDbGuid) // TODO: refactor to use _dbContext
            )
           .AddTransient<TrendMarkerCalculator>()
            .AddSingleton<LegacyMapper>()
            .BuildServiceProvider();
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
    
    [Fact]
    public async Task TestTrendDataProcessor_DoesNotReturnTrendsForIndicatorsToSkip()
    {
        // arrange
        var healthMeasureModel0 = new HealthMeasureModelHelper(key: 100)
            .WithIndicatorDimension(indicatorId: Constants.Indicator.GpRegisteredPopulationId)
            .Build();
        var healthMeasureModel1 = new HealthMeasureModelHelper(key: 110)
            .WithIndicatorDimension(indicatorId: Constants.Indicator.ResidentPopulationId)
            .Build();
        
        _dbContext.HealthMeasure.Add(healthMeasureModel0);
        _dbContext.HealthMeasure.Add(healthMeasureModel1);
        _dbContext.SaveChanges();
       
        // act
        await _trendDataProcessor.Process(_serviceProvider);
        var actual0 = _dbContext.HealthMeasure.Find(100);
        var actual1 = _dbContext.HealthMeasure.Find(110);
        
        // assert
        actual0?.TrendDimension.Name.ShouldBe(Constants.Trend.NotYetCalculated);
        actual1?.TrendDimension.Name.ShouldBe(Constants.Trend.NotYetCalculated);
    }
    
    // DHSCFT-559: Test 2 - healthdata (for one indicator) is correctly grouped 
    // mockRepos is called with correctly grouped data (with correct trends ~[from mock calculator?]~)
    // mockJSONwritter is called with expected
    // mock file reader?
    
    // DHSCFT-559: Test 3 - if no healthdata for a group
    // mockRepos is (not?)called with expected default
    // expected JSON is written 
    
    // DHSCFT-559: Test 4 - if one of two groups is aggregate
    // mockRepos is called with expected default
    // expected JSON is written with only the aggregate
    
    // IF time - test repository behaviours 
    
}


// TODO: do we need to reset the Model?
// TODO: method to add/create mock data to be added to the inMemoryDb

