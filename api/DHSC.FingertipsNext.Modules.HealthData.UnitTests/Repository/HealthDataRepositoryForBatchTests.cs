using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryForBatchTests : IDisposable
{
    private readonly HealthDataDbContext _dbContext;
    private readonly BatchHealthDataDbContext _batchHealthDataDbContext;
    private readonly DbContextOptions<BatchHealthDataDbContext> _batchDbContextOptions;
    private readonly SqliteConnection _connection;
    private HealthDataRepository _healthDataRepository;

    public HealthDataRepositoryForBatchTests()
    {
        _connection = new SqliteConnection($"Filename=:memory:");
        _connection.Open();

        var healthDbContextOptions = new DbContextOptionsBuilder<HealthDataDbContext>()
            .UseSqlite(_connection)
            .Options;

        _batchDbContextOptions = new DbContextOptionsBuilder<BatchHealthDataDbContext>()
            .UseSqlite(_connection)
            .Options;

        _dbContext = new HealthDataDbContext(healthDbContextOptions);
        _batchHealthDataDbContext = new BatchHealthDataDbContext(_batchDbContextOptions);

        _dbContext.Database.EnsureCreated();

        _healthDataRepository = new HealthDataRepository(_dbContext, _batchHealthDataDbContext);
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
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
            _batchHealthDataDbContext.Dispose();
            _connection.Close();
            _connection.Dispose();
        }
    }

    [Fact]
    public void RepositoryInitialisationShouldThrowErrorIfNullDBContextIsProvided()
    {
        var act = () => _healthDataRepository = new HealthDataRepository(null!, null!);

        act.ShouldThrow<ArgumentNullException>()
            .Message.ShouldBe("Value cannot be null. (Parameter 'healthDataDbContext')");
    }


    #region DeleteUnpublishedData

    [Fact]
    public async Task DeleteAllHealthMeasureByBatchIdAsyncShouldDeleteUnpublishedDataForBatchIdBelongingToSpecifiedIndicator()
    {
        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(key: 101, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(key: 102, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 2)
            .Build());

        var resultBeforeDeletion = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 1).ToListAsync();
        resultBeforeDeletion.Count.ShouldBe(2);

        // Act
        var result = await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(1, "batchId1");
        var resultAfterDeletion = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 1).ToListAsync();
        var unrelatedIndicator = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 2).ToListAsync();

        // Assert
        resultAfterDeletion.Count.ShouldBe(0);
        unrelatedIndicator.Count.ShouldBe(1);
        result.ShouldBe(true);
    }

    [Fact]
    public void DeleteAllHealthMeasureByBatchIdAsyncShouldThrowErrorIfThereIsAttemptToDeletePublishedData()
    {
        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: true)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // Act
        var act = async () => await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(1, "batchId1");

        // Assert
        act.ShouldThrow<InvalidOperationException>()
            .Message.ShouldBe("Error attempting to delete published batch.");
    }

    [Fact]
    public async Task DeleteAllHealthMeasureByBatchIdAsyncShouldReturnFalseWhenBatchNotFound()
    {
        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: true)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // Act
        var result = await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(2, "batchId1");
        var populatedIndicator = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 1).ToListAsync();

        // Assert
        result.ShouldBe(false);
        populatedIndicator.Count.ShouldBe(1);
    }

    #endregion

    private void PopulateDatabase(HealthMeasureModel healthMeasure)
    {
        _dbContext.HealthMeasure.Add(healthMeasure);
        _dbContext.SaveChanges();
    }
}
