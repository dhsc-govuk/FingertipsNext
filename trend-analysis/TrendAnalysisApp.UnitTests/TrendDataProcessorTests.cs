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
    private const int FirstAreaEntityKey = 1;
    private const int SecondAreaEntityKey = 2;
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
        JArray mockFileContents = new()
        {
            { new JObject { ["indicatorID"] = 1 } }, { new JObject { ["indicatorID"] = 6 } } 
        };
        _mockFileHelper.Read(ExpectedFilePath).Returns(mockFileContents);
        
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
        PopulateMockHealthMeasureData(residentPopulationIndicator.Entity.IndicatorKey, startKey: residentPopulationIndicatorKey);
        
        // act
        await _trendDataProcessor.Process(_serviceProvider);

        // extract
        var actualGpReg = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(hm => hm.HealthMeasureKey == gpRegIndicator.Entity.IndicatorKey);
        
        var actualResPop = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(hm => hm.HealthMeasureKey == residentPopulationIndicator.Entity.IndicatorKey);

        // assert
        actualGpReg?.TrendDimension?.Name.ShouldBe(Constants.Trend.NotYetCalculated);
        actualResPop?.TrendDimension?.Name.ShouldBe(Constants.Trend.NotYetCalculated);
        _mockFileHelper.Received().Read(ExpectedFilePath);
        _mockFileHelper.Received().Write(
            ExpectedFilePath,
            Arg.Is<JArray>(ja => JToken.DeepEquals(ja, mockFileContents))
        );
    }

    [Fact]
    public async Task TestTrendDataProcessor_CalculatesTrendsForRelevantGroupedData()
    {
        // arrange
        const short mockIndicatorKey = 1;
        const int secondAreaStartKey = 201;

        _mockFileHelper.Read(ExpectedFilePath).Returns(
            new JArray { { new JObject { ["indicatorID"] = mockIndicatorKey } } }
        );
        JArray expectedUpdatedFileContents = new()
        {
            {
                new JObject
                {
                    ["indicatorID"] = mockIndicatorKey, ["trendsByArea"] = new JArray
                    {
                        new JObject
                        {
                            ["areaCode"] = "AreaCode1",
                            ["trend"] = Constants.Trend.NoSignificantChange
                        },
                        new JObject
                        {
                            ["areaCode"] = "AreaCode2",
                            ["trend"] = Constants.Trend.CannotBeCalculated
                        }
                    }
                }
            }
        };

        var mockIndicator = _dbContext.IndicatorDimension.Add(new IndicatorDimensionModel
        {
            IndicatorKey = mockIndicatorKey,
            IndicatorId = 1,
            Polarity = Polarity.NoJudgement,
            ValueType = "Directly standardised rate"
        });
        _dbContext.SaveChanges();

        PopulateMockHealthMeasureData(mockIndicator.Entity.IndicatorKey);
        PopulateMockHealthMeasureData(mockIndicator.Entity.IndicatorKey, SecondAreaEntityKey, startKey:secondAreaStartKey, setTrendCannotBeCalculated:true);

        // act
        await _trendDataProcessor.Process(_serviceProvider);

        // extract
        var firstAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey == MockHealthMeasureStartKey
                );
        var secondAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey == secondAreaStartKey
                );
       
        // assert
        firstAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.NoSignificantChange);
        secondAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.CannotBeCalculated);
       _mockFileHelper.Received().Read(ExpectedFilePath);
       _mockFileHelper.Received().Write(
           ExpectedFilePath,
           Arg.Is<JArray>(ja => JToken.DeepEquals(ja, expectedUpdatedFileContents))
       );
    }
    
    [Fact]
       public async Task TestTrendDataProcessor_AddsTrendOnlyToDbIfHealthDataIsNotAggregate()
    {
        // arrange
        const short mockIndicatorKey = 1;
        const int secondAreaStartKey = 201;

        _mockFileHelper.Read(ExpectedFilePath).Returns(
            new JArray { { new JObject { ["indicatorID"] = mockIndicatorKey } } }
        );
        JArray expectedUpdatedFileContents = new()
        {
            {
                new JObject
                {
                    ["indicatorID"] = mockIndicatorKey, ["trendsByArea"] = new JArray
                    {
                        new JObject
                        {
                            ["areaCode"] = "AreaCode1",
                            ["trend"] = Constants.Trend.NoSignificantChange
                        },
                    }
                }
            }
        };

        var mockIndicator = _dbContext.IndicatorDimension.Add(new IndicatorDimensionModel
        {
            IndicatorKey = mockIndicatorKey,
            IndicatorId = 1,
            Polarity = Polarity.NoJudgement,
            ValueType = "Directly standardised rate"
        });
        _dbContext.SaveChanges();

        PopulateMockHealthMeasureData(mockIndicatorKey);
        PopulateMockHealthMeasureData(mockIndicatorKey, SecondAreaEntityKey, startKey: secondAreaStartKey, isAggregate: false, setTrendCannotBeCalculated:true);

        // act
        await _trendDataProcessor.Process(_serviceProvider);

        // extract
        var firstAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey == 1
                );
        var secondAreaResult = _dbContext.HealthMeasure.AsNoTracking()
            .Include(hm => hm.TrendDimension)
            .First(
                hm => hm.HealthMeasureKey == secondAreaStartKey);
       
        // assert
        firstAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.NoSignificantChange);
        secondAreaResult?.TrendDimension.Name.ShouldBe(Constants.Trend.CannotBeCalculated);
       _mockFileHelper.Received().Read(ExpectedFilePath);
       _mockFileHelper.Received().Write(
           ExpectedFilePath,
           Arg.Is<JArray>(ja => JToken.DeepEquals(ja, expectedUpdatedFileContents))
       );
    }

       /// <summary>
       /// Add enough HealthMeasure dimensions to InMemoryDb to allow trends to be calculated.
       /// Defaults to provide aggregate data for an indicator with no significant change.
       /// </summary>
       /// <param name="entityIndicatorKey">Indicator Key</param>
       /// <param name="areaEntityKey">Area Key</param>
       /// <param name="startKey">Initial Key</param>
       /// <param name="isAggregate">Defaults to true, will add non-aggregated data if false.</param>
       /// <param name="startYear">Default start year of 2024</param>
       /// <param name="setTrendCannotBeCalculated">Defaults to false, but will add data for which the trend cannot be calculated if true.</param>
    private void PopulateMockHealthMeasureData(
        short entityIndicatorKey,
        int areaEntityKey = FirstAreaEntityKey,
        int startKey = MockHealthMeasureStartKey,
        bool isAggregate = true,
        int startYear = 2024,
        bool setTrendCannotBeCalculated = false)
    {
        double? count = 4000000;

        if (setTrendCannotBeCalculated)
        {
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
                IsSexAggregatedOrSingle = isAggregate,
                IsAgeAggregatedOrSingle = isAggregate,
                IsDeprivationAggregatedOrSingle = isAggregate,
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

       /// <summary>
       /// Add default Trend and Area dimensions to InMemoryDb that are needed for testing.
       /// </summary>
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
             AreaKey = FirstAreaEntityKey,
             Code = "AreaCode1"
         });
         
         _dbContext.AreaDimension.Add(new AreaDimensionModel
         {
             AreaKey = SecondAreaEntityKey,
             Code = "AreaCode2"
         });
         _dbContext.SaveChanges();
     }
}

