using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Repository;
using TrendAnalysisApp.SearchData;
using NSubstitute;
using Shouldly;
using Newtonsoft.Json.Linq;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository.Models;
using static TrendAnalysisApp.Constants;

namespace TrendAnalysisApp.UnitTests;

public class TrendDataProcessorTests
{
    private readonly IIndicatorJsonFileHelper _mockFileHelper;
    private readonly TrendDataProcessor _trendDataProcessor;
    private readonly ServiceProvider _serviceProvider;
    private readonly HealthMeasureDbContext _dbContext;
    private const string ExpectedFilePath = "SearchData/assets/indicators.json";
    private const byte DefaultTrendEntityKey = 1;
    private const int DefaultAreaEntityKey = 1;
    private const int MockHealthMeasureStartKey = 1;

    public TrendDataProcessorTests()
    {
        var inMemoryDbGuid = Guid.NewGuid().ToString();
        var dbOptions = new DbContextOptionsBuilder().UseInMemoryDatabase(
            inMemoryDbGuid
        );
        _dbContext = new HealthMeasureDbContext(dbOptions.Options);

        var indicatorRepository = new IndicatorRepository(_dbContext);
        
        _mockFileHelper = Substitute.For<IIndicatorJsonFileHelper>();
        _trendDataProcessor = new TrendDataProcessor(indicatorRepository, _mockFileHelper);
        
        _serviceProvider = new ServiceCollection()
            .AddDbContext<
                HealthMeasureDbContext>(options =>
                    options.UseInMemoryDatabase(inMemoryDbGuid)
            )
            .AddTransient<TrendMarkerCalculator>()
            .AddSingleton<LegacyMapper>()
            .BuildServiceProvider();

        SetupDimensions();
    }

    [Fact]
    public void TestUpdateIndicatorSearchDataWritesCorrectDataToFile()
    {
        JArray expectedUpdatedFileContents = new()
        {
            { new JObject { ["indicatorID"] = 1 } },
            {
                new JObject
                {
                    ["indicatorID"] = 2, ["trendsByArea"] = new JArray
                    {
                        new JObject
                        {
                            ["areaCode"] = "ABCAreaCode",
                            ["trend"] = "Increasing and getting worse"
                        }
                    }
                }
            }
        };

        _mockFileHelper.Read(ExpectedFilePath).Returns(
            new JArray { { new JObject { ["indicatorID"] = 1 } }, { new JObject { ["indicatorID"] = 2 } } }
        );
        var mockIndicatorDataForSearch = new IndicatorTrendDataForSearch
        {
            IndicatorId = 2,
        };
        mockIndicatorDataForSearch.AreaToTrendList.Add(
            new AreaWithTrendData("ABCAreaCode", "Increasing and getting worse")
        );
        var mockPerIndicatorData = new List<IndicatorTrendDataForSearch> { mockIndicatorDataForSearch };

        _trendDataProcessor.UpdateIndicatorSearchData(mockPerIndicatorData);

        _mockFileHelper.Received().Read(ExpectedFilePath);
        _mockFileHelper.Received().Write(
            ExpectedFilePath,
            Arg.Is<JArray>(ja => JToken.DeepEquals(ja, expectedUpdatedFileContents))
        );
    }

    [Fact]
    public async Task TestTrendDataProcessor_DoesNotReturnTrendsForIndicatorsToSkip()
    {
        // arrange
        const short gpRegIndicatorKey = 1;
        const short residentPopulationIndicatorKey = 6;
        var gpRegIndicator = _dbContext.IndicatorDimension.Add(new IndicatorDimensionModel
        {
            IndicatorKey = gpRegIndicatorKey,
            IndicatorId = Indicator.GpRegisteredPopulationId,
        });
        var residentPopulationIndicator = _dbContext.IndicatorDimension.Add(new IndicatorDimensionModel
        {
            IndicatorKey = residentPopulationIndicatorKey,
            IndicatorId = Indicator.ResidentPopulationId,
        });
        _dbContext.SaveChanges();

        PopulateMockHealthMeasureData(gpRegIndicator.Entity.IndicatorKey);
        PopulateMockHealthMeasureData(residentPopulationIndicator.Entity.IndicatorKey, DefaultAreaEntityKey, residentPopulationIndicatorKey);
        
        // act
        await _trendDataProcessor.Process(_serviceProvider);

        // extract
        var actualGpReg = _dbContext.HealthMeasure.Find((int)gpRegIndicatorKey);
        var actualResPop = _dbContext.HealthMeasure.Find((int)residentPopulationIndicatorKey);

        // assert
        actualGpReg.TrendDimension.Name.ShouldBe(Constants.Trend.NotYetCalculated);
        actualResPop.TrendDimension.Name.ShouldBe(Constants.Trend.NotYetCalculated);
    }

    [Fact]
    public async Task TestTrendDataProcessor_CalculatesTrendsForRelevantGroupedData()
    {
        // arrange
        _mockFileHelper.Read(ExpectedFilePath).Returns(
            new JArray { { new JObject { ["indicatorID"] = 1 } } }
        );

        const short mockIndicatorKey = 1;

        var mockIndicator = _dbContext.IndicatorDimension.Add(new IndicatorDimensionModel
        {
            IndicatorKey = mockIndicatorKey,
            Polarity = Polarity.NoJudgement,
            ValueType = "Directly standardised rate"
        });
        _dbContext.SaveChanges();

        PopulateMockHealthMeasureData(mockIndicator.Entity.IndicatorKey);
        PopulateMockHealthMeasureData(mockIndicator.Entity.IndicatorKey, DefaultAreaEntityKey+1);

        // act
        await _trendDataProcessor.Process(_serviceProvider);

        // extract
        var firstAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey == DefaultAreaEntityKey
                );
        var secondAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey > 200);
       
        // assert
        firstAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.NoSignificantChange);
        secondAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.CannotBeCalculated);
       
       // TODO: assert that the JSON is as expected
    }

    private void PopulateMockHealthMeasureData(
        short entityIndicatorKey,
        int areaEntityKey = DefaultAreaEntityKey,
        int startKey = MockHealthMeasureStartKey,
        int startYear = 2024)
    {
        double? count = 4000000;
        if (areaEntityKey != DefaultAreaEntityKey)
        {
            startKey += (areaEntityKey * 100);
            count = null;
        }

        for (var i = 0; i < TrendCalculator.RequiredNumberOfDataPoints; i++)
        {
            _dbContext.Add(new HealthMeasureModel
            {
                HealthMeasureKey = startKey + i,
                AreaKey = areaEntityKey,
                IndicatorKey = entityIndicatorKey,
                TrendKey = DefaultTrendEntityKey,
                IsSexAggregatedOrSingle = true,
                IsAgeAggregatedOrSingle = true,
                IsDeprivationAggregatedOrSingle = true,
                Count = count,
                Denominator = 50000000,
                Value = 7,
                LowerCI = 7,
                UpperCI = 7,
                Year = (short)(startYear - i),
            });
        }

        _dbContext.SaveChanges();
    }

    // DHSCFT-559: Test 3 - if no healthdata for a group
    // mockRepos is (not?)called with expected default
    // expected JSON is written 

    // DHSCFT-559: Test 4 - if one of two groups is aggregate
    // mockRepos is called with expected default
    // expected JSON is written with only the aggregate

    // IF time - test repository behaviours 

    // TODO: method to add/create mock data to be added to the inMemoryDb
    // returns the HealthMeasureModel[] in order that it can be asserted against 

   private void SetupDimensions()
     {
         _dbContext.TrendDimension.Add(new TrendDimensionModel
         {
             TrendKey = DefaultTrendEntityKey,
             Name = Constants.Trend.NotYetCalculated
         });
         _dbContext.TrendDimension.Add(new TrendDimensionModel
         {
             TrendKey = 2,
             Name = Constants.Trend.CannotBeCalculated
         });

         _dbContext.TrendDimension.Add(new TrendDimensionModel
         {
             TrendKey = 5,
             Name = Constants.Trend.NoSignificantChange
         });

         _dbContext.AreaDimension.Add(new AreaDimensionModel
         {
             AreaKey = DefaultAreaEntityKey,
         });
         
         _dbContext.AreaDimension.Add(new AreaDimensionModel
         {
             AreaKey = DefaultAreaEntityKey+1,
         });
     }
}

