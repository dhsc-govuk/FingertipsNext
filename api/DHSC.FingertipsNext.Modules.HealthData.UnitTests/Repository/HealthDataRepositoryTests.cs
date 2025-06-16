using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryTests : IDisposable
{
    private readonly HealthDataDbContext _dbContext;

    private readonly IndicatorDimensionModel _indicatorDimension = new()
    {
        IndicatorKey = 1,
        IndicatorId = 500,
        Name = "Foobar",
    };

    private HealthDataRepository _healthDataRepository;

    public HealthDataRepositoryTests()
    {
        DbContextOptionsBuilder dbOptions = new DbContextOptionsBuilder().UseInMemoryDatabase(
            Guid.NewGuid().ToString()
        );

        _dbContext = new HealthDataDbContext(dbOptions.Options);
        _healthDataRepository = new HealthDataRepository(_dbContext);
    }

    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (disposing)
        {
            _dbContext.Dispose();
        }
    }

    [Fact]
    public void RepositoryInitialisationShouldThrowErrorIfNullDBContextIsProvided()
    {
        var act = () => _healthDataRepository = new HealthDataRepository(null!);

        act.ShouldThrow<ArgumentNullException>()
            .Message.ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }

    #region GetIndicatorDimensionAsync

    [Fact]
    public async Task RepositoryShouldReturnCorrectIndicatorAndLatestYearWhenNoAreaCodesProvided()
    {
        const int LATESTYEAR = 2099;
        const int INDICATORID = 1;
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: LATESTYEAR)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .Build());
        PopulateDatabase(new HealthMeasureModel
        {
            IndicatorDimension = new IndicatorDimensionModel
            {
                IndicatorId = INDICATORID
            },
            Year = LATESTYEAR - 1,
            PublishedAt = new DateTime(2025, 1, 1),
            BatchId = $"{INDICATORID}_20990101120000"
        });

        // act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, []);

        // assert
        result.LatestYear.ShouldBe(LATESTYEAR);
    }

    [Fact]
    public async Task RepositoryShouldReturnCorrectIndicatorAndLatestYearWhenAreaCodesProvided()
    {
        // Replicates scenario where England data may be published ahead of sub-areas
        const int ENGLAND_YEAR = 2024;
        const int DISTRICT_YEAR = 2023;
        const string ENGLAND_AREA_CODE = "E92000001";
        const string DISTRICT_ONE_AREA_CODE = "ABC123";
        const string DISTRICT_TWO_AREA_CODE = "123ABC";
        const int INDICATORID = 1;
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: ENGLAND_YEAR)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: ENGLAND_AREA_CODE)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(year: DISTRICT_YEAR, key: 2)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: DISTRICT_ONE_AREA_CODE)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(year: DISTRICT_YEAR, key: 3)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: DISTRICT_TWO_AREA_CODE)
            .Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, [
            ENGLAND_AREA_CODE,
            DISTRICT_ONE_AREA_CODE,
            DISTRICT_TWO_AREA_CODE
        ]);

        // assert
        result.LatestYear.ShouldBe(DISTRICT_YEAR);
    }

    [Fact]
    public async Task RepositoryShouldReturnCorrectIndicatorAndLatestYearWhenEnglandRequested()
    {
        const int ENGLAND_YEAR = 2024;
        const string ENGLAND_AREA_CODE = "E92000001";
        const int INDICATORID = 1;
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: ENGLAND_YEAR)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: ENGLAND_AREA_CODE)
            .Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, [ENGLAND_AREA_CODE]);

        // assert
        result.LatestYear.ShouldBe(ENGLAND_YEAR);
    }

    [Fact]
    public async Task RepositoryShouldReturnCorrectIndicatorAndLatestYearForAllDataWhenAreasContainNoData()
    {
        const int LATEST_YEAR = 2024;
        const string AREA_CODE = "E92000002";
        const int INDICATORID = 1;
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: LATEST_YEAR)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: AREA_CODE)
            .Build());

        // act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, [
            "TESTAREA_ONE",
            "TESTAREA_TWO"
        ]);

        // assert
        result.LatestYear.ShouldBe(LATEST_YEAR);
    }

    #endregion

    #region GetIndicatorDataAsync

    [Fact]
    public async Task GetIndicatorDataAsyncShouldReturnEmptyListIfIndicatorNotFound()
    {
        // arrange
        PopulateDatabase(
            new HealthMeasureModelHelper().WithIndicatorDimension(indicatorId: 1).Build()
        );

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(2, [], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldFindByOnlyIndicatorIdIfQueryParamsAreEmpty()
    {
        // arrange
        const int expectedIndicatorId = 1;
        var expectedHealthMeasure = new HealthMeasureModelHelper()
            .WithIndicatorDimension(indicatorId: expectedIndicatorId)
            .Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(
            expectedIndicatorId,
            [],
            [],
            []
        );

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>() { expectedHealthMeasure }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldFilterResultsByAreaCodesWhenAreaCodesProvided()
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
        var result = await _healthDataRepository.GetIndicatorDataAsync(
            1,
            [expectedAreaCode],
            [],
            []
        );

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldReturnEmptyListIfAreaCodeNotFound()
    {
        // arrange
        PopulateDatabase(
            new HealthMeasureModelHelper()
                .WithIndicatorDimension(indicatorId: 1)
                .WithAreaDimension(code: "Code1")
                .Build()
        );

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, ["Code2"], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldFilterResultsByYearsWhenYearsProvided()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithIndicatorDimension()
            .Build();
        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2021)
            .WithIndicatorDimension()
            .Build();
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 3, year: 2022)
            .WithIndicatorDimension()
            .Build();
        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 4, year: 2023)
            .WithIndicatorDimension()
            .Build();

        PopulateDatabase(unexpectedHealthMeasure1);
        PopulateDatabase(unexpectedHealthMeasure2);
        PopulateDatabase(expectedHealthMeasure1);
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [], [2022, 2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldReturnEmptyListIfYearsNotFound()
    {
        // arrange
        PopulateDatabase(
            new HealthMeasureModelHelper(key: 1, year: 2020)
                .WithIndicatorDimension(indicatorId: 1)
                .Build()
        );
        PopulateDatabase(
            new HealthMeasureModelHelper(key: 2, year: 2021)
                .WithIndicatorDimension(indicatorId: 1)
                .Build()
        );

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(1, [], [2019], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldFilterResultsByAllFiltersWhenProvided()
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
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
                expectedHealthMeasure3,
                expectedHealthMeasure4,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldOnlyIncludeResultsWithoutASexDimensionValue()
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
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>() { expectedHealthMeasure }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWhenIndicatorHasASingleSexDimensionValue()
    {
        // arrange
        var maleSexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Male",
            HasValue = true,
            IsAggregate = true,
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(maleSexDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(maleSexDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldNotReturnResultsWhenIndicatorHasMultipleSexDimensionValuesAndNoneWithoutSexDimension()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(sexKey: 1, name: "Male", hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
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
    public async Task GetIndicatorDataAsyncShouldOnlyIncludeResultsWithoutAnAgeDimensionValue()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure1.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        unexpectedHealthMeasure2.IsAgeAggregatedOrSingle = false;
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2024)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>() { expectedHealthMeasure }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWhenIndicatorHasASingleAgeDimensionValue()
    {
        // arrange
        var fifteenToFourtyFourYearsAgeDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            Name = "15-44 yrs",
            HasValue = true,
            IsAggregate = true,
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(fifteenToFourtyFourYearsAgeDimension)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldNotReturnResultsWhenIndicatorHasMultipleAgeDimensionValuesAndNoneWithoutAgeDimension()
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
    public async Task GetIndicatorDataAsyncShouldOnlyIncludeResultsWithoutADeprivationDimensionValue()
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
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>() { expectedHealthMeasure }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWhenIndicatorHasASingleDeprivationDimensionValue()
    {
        // arrange
        var secondMostDeprivedDecile = new DeprivationDimensionModel
        {
            DeprivationKey = 1,
            Name = "Second most deprived decile",
            Type = "County & UA deprivation deciles in England",
            Sequence = 9,
            HasValue = true,
            IsAggregate = true,
        };

        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithDeprivationDimension(secondMostDeprivedDecile)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure1);

        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithDeprivationDimension(secondMostDeprivedDecile)
            .WithIndicatorDimension(_indicatorDimension)
            .Build();
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _healthDataRepository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure1,
                expectedHealthMeasure2,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldNotReturnResultsWhenIndicatorHasMultipleDeprivationDimensionValuesAndNoneWithoutDeprivationDimension()
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
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWithOnlySexDimensionDataIfSexInequalityIsSpecified()
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
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>
            {
                healthMeasureWithSex,
                healthMeasureWithNoSexAndNoAge,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWithOnlyAgeDimensionDataIfAgeInequalityIsSpecified()
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
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>
            {
                healthMeasureWithAgeAndNoSex,
                healthMeasureWithNoAgeAndNoSex,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWithOnlyDeprivationDimensionDataIfDeprivationInequalityIsSpecified()
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
        var result = await _healthDataRepository.GetIndicatorDataAsync(
            500,
            [],
            [],
            ["deprivation"]
        );

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>
            {
                healthMeasureWithNoAgeAndDeprivation,
                healthMeasureWithNoAgeAndNoDeprivation,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldIncludeResultsWithAllInequalityDataIfAllAreSpecified()
    {
        // arrange
        var personsSexDimension = new SexDimensionModel()
        {
            SexKey = 0,
            Name = "Persons",
            HasValue = false,
            IsAggregate = true,
        };
        var maleSexDimension = new SexDimensionModel()
        {
            SexKey = 1,
            Name = "Male",
            HasValue = true,
            IsAggregate = false,
        };

        var allAgesDimension = new AgeDimensionModel()
        {
            AgeKey = 0,
            Name = "All ages",
            HasValue = false,
            IsAggregate = true,
        };
        var fourToFiveAgeDimension = new AgeDimensionModel()
        {
            AgeKey = 1,
            Name = "4 - 5",
            HasValue = true,
            IsAggregate = false,
        };

        var allDeprivationDimension = new DeprivationDimensionModel()
        {
            DeprivationKey = 0,
            Name = "All",
            HasValue = false,
            IsAggregate = true,
        };
        var mostDeprivedDimension = new DeprivationDimensionModel()
        {
            DeprivationKey = 1,
            Name = "Most deprived decile",
            HasValue = true,
            IsAggregate = false,
        };

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
        var result = await _healthDataRepository.GetIndicatorDataAsync(
            500,
            [],
            [],
            ["age", "sex", "deprivation"]
        );

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(8);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>
            {
                allDimensionsDataPoint,
                sexOnlyDataPoint,
                ageOnlyDataPoint,
                deprivationOnlyDataPoint,
                sexAndAgeDataPoint,
                sexAndDeprivationDataPoint,
                ageAndDeprivationDataPoint,
                aggregateDataPoint,
            }
        );
    }

    [Fact]
    public async Task GetIndicatorDimensionAsyncShouldNotReturnUnpublishedDataAreaData()
    {
        const int ENGLAND_YEAR = 2024;
        const int DISTRICT_YEAR = 2025;
        const string ENGLAND_AREA_CODE = "E92000001";
        const string DISTRICT_ONE_AREA_CODE = "ABC123";
        const int INDICATORID = 1;

        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: ENGLAND_YEAR)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: ENGLAND_AREA_CODE)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(year: DISTRICT_YEAR, key: 2, isPublished: false)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: DISTRICT_ONE_AREA_CODE)
            .Build());

        // Act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, [
            ENGLAND_AREA_CODE,
            DISTRICT_ONE_AREA_CODE
        ]);

        // Assert
        result.LatestYear.ShouldBe(ENGLAND_YEAR);
    }

    [Fact]
    public async Task GetIndicatorDimensionAsyncShouldNotReturnUnpublishedDataNoAreaData()
    {
        const string AREA_CODE = "E92000002";
        const int INDICATORID = 1;

        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(year: 2024, isPublished: false)
            .WithIndicatorDimension(indicatorId: INDICATORID)
            .WithAreaDimension(code: AREA_CODE)
            .Build());

        // Act
        var result = await _healthDataRepository.GetIndicatorDimensionAsync(1, [
            "TESTAREA_ONE",
            "TESTAREA_TWO"
        ]);

        // Assert
        result.ShouldBe(null);
    }

    [Fact]
    public async Task GetIndicatorDataAsyncShouldNotReturnUnpublishedData()
    {
        // Arrange
        const string expectedAreaCode = "Code1";
        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 2, year: 2024)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: expectedAreaCode)
            .Build();

        var unpublishedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2025, isPublished: false)
            .WithIndicatorDimension(indicatorId: 1)
            .WithAreaDimension(code: expectedAreaCode)
            .Build();

        PopulateDatabase(expectedHealthMeasure);
        PopulateDatabase(unpublishedHealthMeasure);

        // Act
        var result = await _healthDataRepository.GetIndicatorDataAsync(
                    1,
                    [expectedAreaCode],
                    [],
                    []
                );

        // Assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(
            new List<HealthMeasureModel>()
            {
                expectedHealthMeasure
            }
        );
    }

    #endregion

    #region GetAreasAsync

    [Fact]
    public async Task GetAreasAsyncShouldReturnMatchingAreasInDatabaseWhenRequestIncludesAreasThatAreNotPresent()
    {
        // arrange
        var healthMeasure0 = new HealthMeasureModelHelper(key: 100)
            .WithAreaDimension("Code1", "Area 1")
            .Build();
        var healthMeasure1 = new HealthMeasureModelHelper(key: 101)
            .WithAreaDimension("Code2", "Area 2")
            .Build();
        var healthMeasure2 = new HealthMeasureModelHelper(key: 102)
            .WithAreaDimension("Code3", "Area 3")
            .Build();

        PopulateDatabase(healthMeasure0);
        PopulateDatabase(healthMeasure1);
        PopulateDatabase(healthMeasure2);

        // act
        var returnedAreas = await _healthDataRepository.GetAreasAsync(
            ["Code1", "Code2", "Code3", "Code4"]
        );

        // assert
        returnedAreas.ShouldNotBeEmpty();
        returnedAreas.Count().ShouldBe(3);
        returnedAreas.ShouldContain(area => area.Code == "Code1");
        returnedAreas.ShouldContain(area => area.Code == "Code2");
        returnedAreas.ShouldContain(area => area.Code == "Code3");
        returnedAreas.ShouldNotContain(area => area.Code == "Code4");
    }

    #endregion

    private void PopulateDatabase(HealthMeasureModel healthMeasure)
    {
        _dbContext.HealthMeasure.Add(healthMeasure);
        _dbContext.SaveChanges();
    }
}
