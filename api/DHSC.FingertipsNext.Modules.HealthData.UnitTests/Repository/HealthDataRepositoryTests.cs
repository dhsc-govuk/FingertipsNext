using Shouldly;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryTests
{
    private readonly HealthDataDbContext _dbContext;
    private HealthDataRepository _repository;

    public HealthDataRepositoryTests()
    {
        DbContextOptionsBuilder dbOptions = new DbContextOptionsBuilder()
            .UseInMemoryDatabase(
                Guid.NewGuid().ToString()
            );

        _dbContext = new HealthDataDbContext(dbOptions.Options);
        _repository = new HealthDataRepository(_dbContext);
    }

    [Fact]
    public void RepositoryInitialisation_ShouldThrowError_IfNullDBContextIsProvided()
    {
        var act = () => _repository = new HealthDataRepository(null!);

        act.ShouldThrow<ArgumentNullException>().Message
            .ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfIndicatorNotFound()
    {
        // arrange
        PopulateDatabase(new HealthMeasureModelHelper().WithIndicatorDimension(indicatorId: 1).Build());

        // act
        var result = await _repository.GetIndicatorDataAsync(2, [], [], []);

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
        var result = await _repository.GetIndicatorDataAsync(expectedIndicatorId, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure
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
        var result = await _repository.GetIndicatorDataAsync(1, [expectedAreaCode], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure1,
            expectedHealthMeasure2,
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
        var result = await _repository.GetIndicatorDataAsync(1, ["Code2"], [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByYears_WhenYearsProvided()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithIndicatorDimension(indicatorId: 1).Build();
        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2021)
            .WithIndicatorDimension(indicatorId: 1).Build();
        var expectedHealthMeasure1 = new HealthMeasureModelHelper(key: 3, year: 2022)
            .WithIndicatorDimension(indicatorId: 1).Build();
        var expectedHealthMeasure2 = new HealthMeasureModelHelper(key: 4, year: 2023)
            .WithIndicatorDimension(indicatorId: 1).Build();

        PopulateDatabase(unexpectedHealthMeasure1);
        PopulateDatabase(unexpectedHealthMeasure2);
        PopulateDatabase(expectedHealthMeasure1);
        PopulateDatabase(expectedHealthMeasure2);

        // act
        var result = await _repository.GetIndicatorDataAsync(1, [], [2022, 2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure1,
            expectedHealthMeasure2,
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
        var result = await _repository.GetIndicatorDataAsync(1, [], [2019], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByAllFilters_WhenProvided()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAreaDimension(code: "Code1").WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2023)
            .WithAreaDimension(code: "Code2").WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var unexpectedHealthMeasure3 = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithAreaDimension(code: "Code1").WithIndicatorDimension(indicatorId: 1).Build();
        PopulateDatabase(unexpectedHealthMeasure3);

        var unexpectedHealthMeasure4 = new HealthMeasureModelHelper(key: 4, year: 2023)
            .WithAreaDimension(code: "Code1").WithSexDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure4);

        var unexpectedHealthMeasure5 = new HealthMeasureModelHelper(key: 5, year: 2023)
            .WithAreaDimension(code: "Code1").WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure5);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 6, year: 2023)
            .WithAreaDimension(code: "Code1").WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, ["Code1"], [2023], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure
        });
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutASexDimensionValue()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithSexDimension(hasValue: true).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithSexDimension(hasValue: true).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2023)
            .WithSexDimension(hasValue: false).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure
        });
    }

    [Fact]
    public async Task Repository_ShouldOnlyIncludeResultsWithoutAnAgeDimensionValue()
    {
        // arrange
        var unexpectedHealthMeasure1 = new HealthMeasureModelHelper(key: 1, year: 2020)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure1);

        var unexpectedHealthMeasure2 = new HealthMeasureModelHelper(key: 2, year: 2022)
            .WithAgeDimension(hasValue: true).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(unexpectedHealthMeasure2);

        var expectedHealthMeasure = new HealthMeasureModelHelper(key: 3, year: 2024)
            .WithAgeDimension(hasValue: false).WithIndicatorDimension(indicatorId: 500).Build();
        PopulateDatabase(expectedHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            expectedHealthMeasure
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithSexDimensionData_IfSexInequalityIsSpecified()
    {
        // arrange
        var maleHealthMeasure = new HealthMeasureModelHelper(key: 1, 2020)
            .WithSexDimension(hasValue: true, isFemale: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(maleHealthMeasure);

        var femaleHealthMeasure = new HealthMeasureModelHelper(key: 2, 2020)
            .WithSexDimension(hasValue: true, isFemale: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(femaleHealthMeasure);

        var personsHealthMeasure = new HealthMeasureModelHelper(key: 3, 2020)
            .WithSexDimension(hasValue: false, isFemale: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(personsHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [], ["sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            maleHealthMeasure,
            personsHealthMeasure
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithAgeDimensionData_IfAgeInequalityIsSpecified()
    {
        // arrange
        var maleHealthMeasure = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(hasValue: true, isFemale: false)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(maleHealthMeasure);

        var femaleHealthMeasure = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true, isFemale: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(femaleHealthMeasure);

        var personsHealthMeasure = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: false, isFemale: false)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(personsHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [], ["age"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            personsHealthMeasure
        });
    }

    [Fact]
    public async Task Repository_ShouldIncludeResultsWithAllInequalityData_IfBothAreSpecified()
    {
        // arrange
        var maleHealthMeasure = new HealthMeasureModelHelper(1, 2020)
            .WithSexDimension(hasValue: true, isFemale: false)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(maleHealthMeasure);

        var femaleHealthMeasure = new HealthMeasureModelHelper(2, 2020)
            .WithSexDimension(hasValue: true, isFemale: true)
            .WithAgeDimension(hasValue: true)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(femaleHealthMeasure);

        var personsHealthMeasure = new HealthMeasureModelHelper(3, 2020)
            .WithSexDimension(hasValue: false, isFemale: false)
            .WithAgeDimension(hasValue: false)
            .WithIndicatorDimension(indicatorId: 500)
            .Build();
        PopulateDatabase(personsHealthMeasure);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [], ["age", "sex"]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(3);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            maleHealthMeasure,
            femaleHealthMeasure,
            personsHealthMeasure
        });
    }

    private void PopulateDatabase(HealthMeasureModel healthMeasure)
    {
        _dbContext.HealthMeasure.Add(healthMeasure);
        _dbContext.SaveChanges();
    }
}
    