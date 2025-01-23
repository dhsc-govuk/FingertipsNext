using Shouldly;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using Microsoft.EntityFrameworkCore;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.AspNetCore.Http;

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

        act.ShouldThrow<ArgumentNullException>().Message.ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfIndicatorNotFound()
    {
        // arrange
        await PopulateDatabase("Code", 2020);

        // act
        var result = await _repository.GetIndicatorDataAsync(3, [], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFindByOnlyIndicatorId_IfQueryParamsAreEmpty()
    {
        // arrange
        await PopulateDatabase("Code", 2020);

        // act
        var result = await _repository.GetIndicatorDataAsync(1, [], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            TestHelper.BuildHealthMeasureModel("Code", 2020, DateTime.Parse("2024-03-21 13:26"))
        });
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByAreaCodes_WhenAreaCodesProvided()
    {
        // arrange
        await PopulateDatabase("Code1", 2020, 1, 500);
        await PopulateDatabase("Code2", 2023, 2, 500);
        await PopulateDatabase("Code2", 2022, 3, 500);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, ["Code2"], []);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(2);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>()
        {
            TestHelper.BuildHealthMeasureModel("Code2", 2022, DateTime.Parse("2024-03-21 13:26"), 3, 500),
            TestHelper.BuildHealthMeasureModel("Code2", 2023, DateTime.Parse("2024-03-21 13:26"), 2, 500),
        });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfAreaCodeNotFound()
    {
        // arrange
        await PopulateDatabase("Code1", 2020);

        // act
        var result = await _repository.GetIndicatorDataAsync(1, ["Code2"], []);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByYears_WhenYearsProvided()
    {
        // arrange
        await PopulateDatabase("Code1", 2020, 1, 500);
        await PopulateDatabase("Code1", 2023, 2, 500);
        await PopulateDatabase("Code2", 2023, 3, 500);
        await PopulateDatabase("Code3", 2022, 4, 500);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [2022, 2023]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(3);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>() {
                TestHelper.BuildHealthMeasureModel("Code3", 2022, DateTime.Parse("2024-03-21 13:26"), 4, 500),
                TestHelper.BuildHealthMeasureModel("Code1", 2023, DateTime.Parse("2024-03-21 13:26"), 2, 500),
                TestHelper.BuildHealthMeasureModel("Code2", 2023, DateTime.Parse("2024-03-21 13:26"), 3, 500),
            });
    }

    [Fact]
    public async Task Repository_ShouldReturnEmptyList_IfYearsNotFound()
    {
        // arrange
        await PopulateDatabase("Code1", 2020, 1, 500);
        await PopulateDatabase("Code2", 2020, 2, 500);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, [], [2019]);

        // assert
        result.ShouldBeEmpty();
    }

    [Fact]
    public async Task Repository_ShouldFilterResultsByAllThreeFilters_WhenProvided()
    {
        // arrange
        await PopulateDatabase("Code1", 2020, 1, 500);
        await PopulateDatabase("Code1", 2023, 2, 500);
        await PopulateDatabase("Code2", 2023, 3, 500);
        await PopulateDatabase("Code3", 2022, 4, 500);

        // act
        var result = await _repository.GetIndicatorDataAsync(500, ["Code1"], [2023]);

        // assert
        result.ShouldNotBeEmpty();
        result.Count().ShouldBe(1);
        result.ShouldBeEquivalentTo(new List<HealthMeasureModel>() {
                TestHelper.BuildHealthMeasureModel("Code1", 2023, DateTime.Parse("2024-03-21 13:26"), 2, 500),
            });
    }

    private async Task PopulateDatabase(string code, short year, int id = 1, int? indicatorId = null)
    {
        await _dbContext.HealthMeasure
            .AddAsync(TestHelper.BuildHealthMeasureModel(code, year, DateTime.Parse("2024-03-21 13:26"), id, indicatorId));
        await _dbContext.SaveChangesAsync();
    }
}
