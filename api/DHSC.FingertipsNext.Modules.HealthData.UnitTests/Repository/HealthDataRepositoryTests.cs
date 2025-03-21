﻿using Shouldly;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryTests
{
    private readonly HealthDataDbContext _dbContext;
    private HealthDataRepository _healthDataRepository;

    public HealthDataRepositoryTests()
    {
        DbContextOptionsBuilder dbOptions = new DbContextOptionsBuilder()
            .UseInMemoryDatabase(
                Guid.NewGuid().ToString()
            );

        _dbContext = new HealthDataDbContext(dbOptions.Options);
        _healthDataRepository = new HealthDataRepository(_dbContext);
    }

    [Fact]
    public void RepositoryInitialisation_ShouldThrowError_IfNullDBContextIsProvided()
    {
        var act = () => _healthDataRepository = new HealthDataRepository(null!);

        act.ShouldThrow<ArgumentNullException>().Message
            .ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfIndicatorNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper().WithIndicatorDimension(indicatorId: 1).Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(2, [], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFindByOnlyIndicatorId_IfQueryParamsAreEmpty()
    {
        // arrange
        const int expectedIndicatorId = 1;
        var expectedHealthMeasure = new HealthMeasureModelHelper()
            .WithIndicatorDimension(indicatorId: expectedIndicatorId)
            .Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(expectedIndicatorId, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure)
        });
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByAreaCodes_WhenAreaCodesProvided()
    {
        // arrange
        const string unexpectedAreaCode = "Code1";
        const string expectedAreaCode = "Code2";

        var unexpectedHealthMeasure = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: unexpectedAreaCode)
            .Build();

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: expectedAreaCode)
            .Build();

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: expectedAreaCode)
            .Build();

        PopulateDatabase(unexpectedHealthMeasure);
        PopulateDatabase(expectedHealthMeasure1);
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [expectedAreaCode], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
        });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfAreaCodeNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper()
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: "Code1")
            .Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, ["Code2"], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByYears_WhenYearsProvided()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithIndicatorDimension().Build();
        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2021)
            .WithIndicatorDimension().Build();
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 3, year: 2022)
            .WithIndicatorDimension().Build();
        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 4, year: 2023)
            .WithIndicatorDimension().Build();

        PopulateDatabase(unexpectedHealthMeasure1);
        PopulateDatabase(unexpectedHealthMeasure2);
        PopulateDatabase(expectedHealthMeasure1);
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [], [2022, 2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
        });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfYearsNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithIndicatorDimension(indicatorId: 1)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(key: 2, year: 2021)
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [], [2019], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByAllFilters_WhenProvided()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAreaDimension(code: "Code1")
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2023)
            .WithAreaDimension(code: "Code2")
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var unexpectedHealthMeasure3 = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure3);

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 4, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithSexDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 5, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure2);

        var expectedHealthMeasure3 = new HealthMeasureModelHelper(key: 6, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure3);

        var expectedHealthMeasure4 = new HealthMeasureModelHelper(key: 7, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure4);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, ["Code1"], [2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(4);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
            ResetKeys(expectedHealthMeasure3),
            ResetKeys(expectedHealthMeasure4)
        });
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutASexDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithSexDimension(hasValue: false)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        expectedHealthMeasure.IsSexAggregatedOrSingle = true;
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure)
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWhenIndicatorHasASingleSexDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };

        var maleSexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Male",
            HasValue = true,
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
        });
    }

 

    [Fact]
    public async Task Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleSexDimensionValuesAndNoneWithoutSexDimension()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(sexKey: 1, name: "Male", hasValue: true)
            .WithIndicatorDimension(indicatorDimension).Build();
        unexpectedHealthMeasure1.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(sexKey: 2, name: "Female", hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutAnAgeDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(indicatorDimension).Build();
        unexpectedHealthMeasure1.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(indicatorDimension).Build();
        unexpectedHealthMeasure2.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2024)
            .WithAgeDimension(hasValue: false).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure)
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWhenIndicatorHasASingleAgeDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };

        var fifteenToFourtyFourYearsAgeDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            Name = "15-44 yrs",
            HasValue = true,
        };
        
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);
        
        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
        });
    }


    [Fact]
    public async Task Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleAgeDimensionValuesAndNoneWithoutAgeDimension()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };

        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(ageKey: 1, name: "15-44 yrs", hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(ageKey: 2, name: "65+ yrs", hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutADeprivationDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2024)
            .WithDeprivationDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure)
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWhenIndicatorHasASingleDeprivationDimensionValue()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };

        var secondMostDeprivedDecile = new DeprivationDimensionModel
        {
            DeprivationKey = 1,
            Name = "Second most deprived decile",
            Type = "County & UA deprivation deciles in England",
            Sequence = 9,
            HasValue = true
        };
        
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);
        
        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2),
        });
    }


    [Fact]
    public async Task Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleDeprivationDimensionValuesAndNoneWithoutDeprivationDimension()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(name: "Most deprived decile", hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(name: "Second most deprived decile", hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithOnlySexDimensionData_IfSexInequalityIsSpecified()
    {
        // arrange
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };

        var healthMeasureWithSex = new HealthMeasureModelHelper(key: 1, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        healthMeasureWithSex.IsSexAggregatedOrSingle = false;
        healthMeasureWithSex.IsAgeAggregatedOrSingle = true;
        PopulateDatabase(healthMeasureWithSex);

        //should NOT be in the results because it is not aggregated for age and age is not specified
        var healthMeasureWithSexAndAge = new HealthMeasureModelHelper(key: 2, 2021)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        healthMeasureWithSexAndAge.IsSexAggregatedOrSingle = false;
        healthMeasureWithSexAndAge.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithSexAndAge);

        var healthMeasureWithNoSexAndNoAge = new HealthMeasureModelHelper(key: 3, 2022)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorDimension)
            .Build();
        healthMeasureWithNoSexAndNoAge.IsSexAggregatedOrSingle=true;
        healthMeasureWithNoSexAndNoAge.IsAgeAggregatedOrSingle = true;
        PopulateDatabase(healthMeasureWithNoSexAndNoAge);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
    }

   

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithAllInequalityData_IfBothAreSpecified()
    {
        // arrange
        var maleHealthMeasure = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        maleHealthMeasure.IsAgeAggregatedOrSingle = false;
        maleHealthMeasure.IsSexAggregatedOrSingle = false;
        PopulateDatabase(maleHealthMeasure);

        var femaleHealthMeasure = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        femaleHealthMeasure.IsAgeAggregatedOrSingle = false;
        femaleHealthMeasure.IsSexAggregatedOrSingle = false;
        PopulateDatabase(femaleHealthMeasure);

        var personsHealthMeasure = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        personsHealthMeasure.IsAgeAggregatedOrSingle = true;
        personsHealthMeasure.IsSexAggregatedOrSingle = true;
        PopulateDatabase(personsHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["age", "sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(3);
    }

    private void PopulateDatabase(HealthMeasureModel healthMeasure)
    {
        _dbContext.HealthMeasure.Add(healthMeasure);
        _dbContext.SaveChanges();
    }

    private static HealthMeasureModel ResetKeys(HealthMeasureModel healthMeasure)
    {
        healthMeasure.HealthMeasureKey = 0;

        healthMeasure.AreaDimension.AreaKey = 0;
        healthMeasure.AgeDimension.AgeKey = 0;
        healthMeasure.IndicatorDimension.IndicatorKey = 0;
        healthMeasure.SexDimension.SexKey = 0;

        healthMeasure.AgeKey = 0;
        healthMeasure.IndicatorKey = 0;
        healthMeasure.IndicatorDimension.IndicatorId = 0;
        healthMeasure.IndicatorDimension.StartDate = new DateTime();
        healthMeasure.IndicatorDimension.EndDate = new DateTime();

        healthMeasure.AreaKey = 0;
        healthMeasure.SexKey = 0;
        healthMeasure.AreaDimension.StartDate = new DateTime();
        healthMeasure.AreaDimension.EndDate = new DateTime();

        healthMeasure.TrendKey = 0;
        healthMeasure.TrendDimension.TrendKey = 0;

        healthMeasure.DeprivationKey = 0;
        healthMeasure.DeprivationDimension.DeprivationKey = 0;

        return healthMeasure;
    }
}
