using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Shouldly;

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

        var unexpectedHealthMeasure = new HealthMeasureModelHelper(1, 2020)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(unexpectedAreaCode)
            .Build();

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(2, 2022)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(expectedAreaCode)
            .Build();

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(3, 2023)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(expectedAreaCode)
            .Build();

        PopulateDatabase(unexpectedHealthMeasure);
        PopulateDatabase(expectedHealthMeasure1);
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [expectedAreaCode], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2)
        });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfAreaCodeNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper()
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension("Code1")
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithIndicatorDimension().Build();
        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2021)
            .WithIndicatorDimension().Build();
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(3, 2022)
            .WithIndicatorDimension().Build();
        var expectedHealthMeasure2 = new HealthMeasureModelHelper(4, 2023)
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
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2)
        });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfYearsNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(1, 2020)
            .WithIndicatorDimension(indicatorId: 1)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(2, 2021)
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithAreaDimension("Code1").WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2023)
            .WithAreaDimension("Code2").WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var unexpectedHealthMeasure3 = new HealthMeasureModelHelper(3, 2023)
            .WithAreaDimension("Code1").WithIndicatorDimension(indicatorId: 1).Build();
        PopulateDatabase(unexpectedHealthMeasure3);

        var unexpectedHealthMeasure4 = new HealthMeasureModelHelper(4, 2023)
            .WithAreaDimension("Code1").WithSexDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure4);

        var unexpectedHealthMeasure5 = new HealthMeasureModelHelper(5, 2023)
            .WithAreaDimension("Code1").WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure5);

        var unexpectedHealthMeasure6 = new HealthMeasureModelHelper(6, 2023)
            .WithAreaDimension("Code1").WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure6);

        var expectedHealthMeasure = new HealthMeasureModelHelper(7, 2023)
            .WithAreaDimension("Code1").WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, ["Code1"], [2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure)
        });
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutASexDimensionValue()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithSexDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(3, 2023)
            .WithSexDimension(hasValue: false).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
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
            HasValue = true
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithSexDimension(maleSexDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2)
        });
    }

    [Fact]
    public async Task
        Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleSexDimensionValuesAndNoneWithoutSexDimension()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(1, "Male", true)
            .WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithSexDimension(2, "Female", true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(3, 2024)
            .WithAgeDimension(hasValue: false).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
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
            HasValue = true
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2)
        });
    }


    [Fact]
    public async Task
        Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleAgeDimensionValuesAndNoneWithoutAgeDimension()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithAgeDimension(1, "15-44 yrs", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithAgeDimension(2, "65+ yrs", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
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
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithDeprivationDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(3, 2024)
            .WithDeprivationDimension(hasValue: false).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
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
            HasValue = true
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithDeprivationDimension(secondMostDeprivedDecile).WithIndicatorDimension(_indicatorDimension).Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(expectedHealthMeasure1),
            ResetKeys(expectedHealthMeasure2)
        });
    }


    [Fact]
    public async Task
        Repository_ShouldNotReturnResultsWhenIndicatorHasMultipleDeprivationDimensionValuesAndNoneWithoutDeprivationDimension()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(1, 2020)
            .WithDeprivationDimension("Most deprived decile", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(2, 2022)
            .WithDeprivationDimension("Second most deprived decile", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
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

        var healthMeasureWithSex = new HealthMeasureModelHelper(1, 2020, false)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithSex);

        var healthMeasureWithSexAndAge = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithSexAndAge);

        var healthMeasureWithNoSexAndNoAge = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: false)
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
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            IndicatorId = 500
        };
        
        var healthMeasureWithAgeAndNoSex = new HealthMeasureModelHelper(1, 2020, false)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithAgeAndNoSex);

        var healthMeasureWithAgeAndSex = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(healthMeasureWithAgeAndSex);

        var healthMeasureWithNoAgeAndSex = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
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
    public async Task Repository_ShouldIncludeResultsWithAllInequalityData_IfBothAreSpecified()
    {
        // arrange
        var maleHealthMeasure = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(maleHealthMeasure);

        var femaleHealthMeasure = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(femaleHealthMeasure);

        var personsHealthMeasure = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(personsHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], ["age", "sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(3);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>
        {
            ResetKeys(maleHealthMeasure),
            ResetKeys(femaleHealthMeasure),
            ResetKeys(personsHealthMeasure)
        });
    }

    private void PopulateDatabase(HealthMeasureModel healthMeasure)
    {
        _dbContext.HealthMeasure.Add(healthMeasure);
        _dbContext.SaveChanges();
    }

    private HealthMeasureModel ResetKeys(HealthMeasureModel healthMeasure)
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