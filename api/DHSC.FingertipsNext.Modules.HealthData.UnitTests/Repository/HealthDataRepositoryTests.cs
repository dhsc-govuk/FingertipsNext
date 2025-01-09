using FluentAssertions;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using Microsoft.EntityFrameworkCore;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

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
    public void RepositoryInitialization_ShouldThrowError_IfNullDBContextIsProvided()
    {
        var act = () => _repository = new HealthDataRepository(null!);

        act.Should()
            .Throw<ArgumentNullException>()
            .WithMessage("Value cannot be null. (Parameter 'healthDataDbContext')");
    }

    [Fact]
    public void Repository_ShouldReturnEmptyList_IfIndicatorNotFound()
    {
        // arrange
        PopulateDatabase();

        // act
        var result = _repository.GetIndicatorData(3, [], []);

        // assert
        result.Should().BeEmpty();
    }

    [Fact]
    public void Repository_ShouldReturnExpectedResult_IfIndicatorIsFound()
    {
        // arrange
        PopulateDatabase();

        // act
        var result = _repository.GetIndicatorData(1, [], []);

        // assert
        result.Should().NotBeEmpty();
        result.Should().HaveCount(1);
        result.Should().BeEquivalentTo([GetHealthMeasure()]);
    }

    private void PopulateDatabase()
    {
        _dbContext.HealthMeasure.Add(GetHealthMeasure());
        _dbContext.SaveChanges();
    }

    private static HealthMeasureModel GetHealthMeasure()
    {
        var areaDimension = new AreaDimensionModel
        {
            AreaKey = 1,
            Code = "Code",
            Name = "Name",
            StartDate = DateTime.Parse("2024-03-21 13:26"),
            EndDate = DateTime.Parse("2024-03-21 13:26"),
        };
        var indicatorDimension = new IndicatorDimensionModel
        {
            IndicatorKey = 1,
            Name = "Name",
            IndicatorId = 1,
            StartDate = DateTime.Parse("2024-03-21 13:26"),
            EndDate = DateTime.Parse("2024-03-21 13:26"),
        };
        var sexDimension = new SexDimensionModel
        {
            SexKey = 1,
            Name = "Name",
            IsFemale = true,
            HasValue = true,
            SexId = 1,
        };
        var ageDimension = new AgeDimensionModel
        {
            AgeKey = 1,
            AgeID = 1,
            Name = "Name"
        };

        return new HealthMeasureModel
        {
            HealthMeasureKey = 1,
            Count = 1.0,
            Value = 1.0,
            LowerCI = 1.0,
            UpperCI = 1.0,
            Year = 2007,
            AreaKey = 1,
            AgeKey = 1,
            IndicatorKey = 1,
            SexKey = 1,
            AreaDimension = areaDimension,
            AgeDimension = ageDimension,
            IndicatorDimension = indicatorDimension,
            SexDimension = sexDimension
        };
    }
}
