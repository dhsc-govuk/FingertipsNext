﻿using Shouldly;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryTests
{
    private readonly HealthDataDbContext _dbContext;
    
    private readonly IndicatorDimensionModel _indicatorDimension = new()
    {
        IndicatorKey = 1,
        IndicatorId = 500,
        Name = "Foobar"
    };
    
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAreaDimension(code: "Code1")
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2023)
            .WithAreaDimension(code: "Code2")
            .WithIndicatorDimension(_indicatorDimension)
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
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 5, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure2);

        var expectedHealthMeasure3 = new HealthMeasureModelHelper(key: 6, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure3);

        var expectedHealthMeasure4 = new HealthMeasureModelHelper(key: 7, year: 2023)
            .WithAreaDimension(code: "Code1")
            .WithIndicatorDimension(_indicatorDimension)
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithSexDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
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
        var maleSexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Male",
            HasValue = true,
            IsAggregate = true
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(_indicatorDimension).Build();
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(sexKey: 1, name: "Male", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension).Build();
        unexpectedHealthMeasure1.IsSexAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(sexKey: 2, name: "Female", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        unexpectedHealthMeasure1.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        unexpectedHealthMeasure2.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2024)
            .WithAgeDimension(hasValue: false).WithIndicatorDimension(_indicatorDimension).Build();
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
       var fifteenToFourtyFourYearsAgeDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            Name = "15-44 yrs",
            HasValue = true,
            IsAggregate = true
        };
        
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(_indicatorDimension).Build();
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(ageKey: 1, name: "15-44 yrs", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(ageKey: 2, name: "65+ yrs", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
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
        var secondMostDeprivedDecile = new DeprivationDimensionModel
        {
            DeprivationKey = 1,
            Name = "Second most deprived decile",
            Type = "County & UA deprivation deciles in England",
            Sequence = 9,
            HasValue = true,
            IsAggregate = true
        };
        
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(_indicatorDimension).Build();
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(name: "Most deprived decile", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(name: "Second most deprived decile", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
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
        var healthMeasureWithSex = new HealthMeasureModelHelper(1, 2020, false)
            .WithSexDimension(hasValue: true, sexIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithSex.IsSexAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithSex);

        // should NOT be in the results because it is not aggregated for age and age is not specified
        var healthMeasureWithSexAndAge = new HealthMeasureModelHelper(2, 2021, false)
            .WithSexDimension(hasValue: true, sexIsAggregate: false)
            .WithAgeDimension(hasValue: true, ageIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithSexAndAge.IsSexAggregatedOrSingle = false;
        healthMeasureWithSexAndAge.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithSexAndAge);

        var healthMeasureWithNoSexAndNoAge = new HealthMeasureModelHelper(key: 3, 2022)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithNoSexAndNoAge);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(healthMeasureWithSex),
            ResetKeys(healthMeasureWithNoSexAndNoAge)
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithOnlyAgeDimensionData_IfAgeInequalityIsSpecified()
    {
        // arrange
        var healthMeasureWithAgeAndNoSex = new HealthMeasureModelHelper(1, 2020, false)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: true, ageIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithAgeAndNoSex.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithAgeAndNoSex);

        var healthMeasureWithAgeAndSex = new HealthMeasureModelHelper(2, 2020, false)
            .WithAgeDimension(hasValue: true, ageIsAggregate: false)
            .WithSexDimension(hasValue: true, sexIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithAgeAndSex.IsAgeAggregatedOrSingle = false;
        healthMeasureWithAgeAndSex.IsSexAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithAgeAndSex);

        var healthMeasureWithNoAgeAndSex = new HealthMeasureModelHelper(3, 2020, false)
            .WithAgeDimension(hasValue: false)
            .WithSexDimension(hasValue: true, sexIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithNoAgeAndSex.IsSexAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithNoAgeAndSex);

        var healthMeasureWithNoAgeAndNoSex = new HealthMeasureModelHelper(4, 2020)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithNoAgeAndNoSex);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["age"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(healthMeasureWithAgeAndNoSex),
            ResetKeys(healthMeasureWithNoAgeAndNoSex)
        });
    }

   

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithOnlyDeprivationDimensionData_IfDeprivationInequalityIsSpecified()
    {
        // arrange
        var healthMeasureWithAgeAndNoDeprivation = new HealthMeasureModelHelper(1, 2020, false)
            .WithAgeDimension(hasValue: true, ageIsAggregate: false)
            .WithDeprivationDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithAgeAndNoDeprivation.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithAgeAndNoDeprivation);

        var healthMeasureWithAgeAndDeprivation = new HealthMeasureModelHelper(2, 2020, false)
            .WithAgeDimension(hasValue: true, ageIsAggregate: false)
            .WithDeprivationDimension(hasValue: true, deprivationIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithAgeAndDeprivation.IsAgeAggregatedOrSingle = false;
        healthMeasureWithAgeAndDeprivation.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithAgeAndDeprivation);

        var healthMeasureWithNoAgeAndDeprivation = new HealthMeasureModelHelper(3, 2020, false)
            .WithAgeDimension(hasValue: false)
            .WithDeprivationDimension(hasValue: true, deprivationIsAggregate: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        healthMeasureWithNoAgeAndDeprivation.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(healthMeasureWithNoAgeAndDeprivation);

        var healthMeasureWithNoAgeAndNoDeprivation = new HealthMeasureModelHelper(4, 2020)
            .WithAgeDimension(hasValue: false)
            .WithDeprivationDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithNoAgeAndNoDeprivation);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["deprivation"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(healthMeasureWithNoAgeAndDeprivation),
            ResetKeys(healthMeasureWithNoAgeAndNoDeprivation),
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithAllInequalityData_IfAllAreSpecified()
    {
        // arrange
        var personsSexDimension = new SexDimensionModel() { SexKey = 0, Name = "Persons", HasValue = false, IsAggregate = true};
        var maleSexDimension = new SexDimensionModel() { SexKey = 1, Name = "Male", HasValue = true, IsAggregate = false };

        var allAgesDimension = new AgeDimensionModel() { AgeKey = 0, Name = "All ages", HasValue = false, IsAggregate = true};
        var fourToFiveAgeDimension = new AgeDimensionModel() { AgeKey = 1, Name = "4 - 5", HasValue = true, IsAggregate = false };

        var allDeprivationDimension = new DeprivationDimensionModel() { DeprivationKey = 0, Name = "All", HasValue = false, IsAggregate = true};
        var mostDeprivedDimension = new DeprivationDimensionModel() { DeprivationKey = 1, Name = "Most deprived decile", HasValue = true, IsAggregate = false };

        var allDimensionsDataPoint = new HealthMeasureModelHelper(1, 2020, isAggregate: false)
            .WithSexDimension(maleSexDimension)
            .WithAgeDimension(fourToFiveAgeDimension)
            .WithDeprivationDimension(mostDeprivedDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        allDimensionsDataPoint.IsAgeAggregatedOrSingle = false;
        allDimensionsDataPoint.IsSexAggregatedOrSingle = false;
        allDimensionsDataPoint.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(allDimensionsDataPoint);

        var sexOnlyDataPoint = new HealthMeasureModelHelper(2, 2020, isAggregate: false)
            .WithSexDimension(maleSexDimension)
            .WithAgeDimension(allAgesDimension)
            .WithDeprivationDimension(allDeprivationDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        sexOnlyDataPoint.IsSexAggregatedOrSingle = false;
        PopulateDatabase(sexOnlyDataPoint);

        var ageOnlyDataPoint = new HealthMeasureModelHelper(3, 2020, isAggregate: false)
            .WithSexDimension(personsSexDimension)
            .WithAgeDimension(fourToFiveAgeDimension)
            .WithDeprivationDimension(allDeprivationDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        ageOnlyDataPoint.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(ageOnlyDataPoint);

        var deprivationOnlyDataPoint = new HealthMeasureModelHelper(4, 2020, isAggregate: false)
            .WithSexDimension(personsSexDimension)
            .WithAgeDimension(allAgesDimension)
            .WithDeprivationDimension(mostDeprivedDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        deprivationOnlyDataPoint.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(deprivationOnlyDataPoint);

        var sexAndAgeDataPoint = new HealthMeasureModelHelper(5, 2020, isAggregate: false)
            .WithSexDimension(maleSexDimension)
            .WithAgeDimension(fourToFiveAgeDimension)
            .WithDeprivationDimension(allDeprivationDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        sexAndAgeDataPoint.IsSexAggregatedOrSingle = false;
        sexAndAgeDataPoint.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(sexAndAgeDataPoint);

        var sexAndDeprivationDataPoint = new HealthMeasureModelHelper(6, 2020, isAggregate: false)
            .WithSexDimension(maleSexDimension)
            .WithAgeDimension(allAgesDimension)
            .WithDeprivationDimension(mostDeprivedDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        sexAndDeprivationDataPoint.IsSexAggregatedOrSingle = false;
        sexAndDeprivationDataPoint.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(sexAndDeprivationDataPoint);

        var ageAndDeprivationDataPoint = new HealthMeasureModelHelper(7, 2020, isAggregate: false)
            .WithSexDimension(personsSexDimension)
            .WithAgeDimension(fourToFiveAgeDimension)
            .WithDeprivationDimension(mostDeprivedDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        ageAndDeprivationDataPoint.IsAgeAggregatedOrSingle = false;
        ageAndDeprivationDataPoint.IsDeprivationAggregatedOrSingle = false;
        PopulateDatabase(ageAndDeprivationDataPoint);

        var aggregateDataPoint = new HealthMeasureModelHelper(8, 2020)
            .WithSexDimension(personsSexDimension)
            .WithAgeDimension(allAgesDimension)
            .WithDeprivationDimension(allDeprivationDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(aggregateDataPoint);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["age", "sex", "deprivation"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(8);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(allDimensionsDataPoint),
            ResetKeys(sexOnlyDataPoint),
            ResetKeys(ageOnlyDataPoint),
            ResetKeys(deprivationOnlyDataPoint),
            ResetKeys(sexAndAgeDataPoint),
            ResetKeys(sexAndDeprivationDataPoint),
            ResetKeys(ageAndDeprivationDataPoint),
            ResetKeys(aggregateDataPoint)
        });
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

        healthMeasure.AreaKey = 0;
        healthMeasure.SexKey = 0;

        healthMeasure.TrendKey = 0;
        healthMeasure.TrendDimension.TrendKey = 0;

        healthMeasure.DeprivationKey = 0;
        healthMeasure.DeprivationDimension.DeprivationKey = 0;
        
        // We don't load these values when retrieving a health measure from the DB, so they default to true.
        healthMeasure.IsAgeAggregatedOrSingle = true;
        healthMeasure.IsSexAggregatedOrSingle = true;
        healthMeasure.IsDeprivationAggregatedOrSingle = true;

        return healthMeasure;
    }

    
}
