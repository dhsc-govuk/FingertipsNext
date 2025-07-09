using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;
using Microsoft.Data.Sqlite;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Repository;

public class HealthDataRepositoryDeleteTests : IDisposable
{
    private readonly HealthDataDbContext _dbContext;
    private readonly SqliteConnection _connection;
    private HealthDataRepository _healthDataRepository;

    public HealthDataRepositoryDeleteTests()
    {
        _connection = new SqliteConnection($"Filename=:memory:");
        _connection.Open();

        var healthDbContextOptions = new DbContextOptionsBuilder<HealthDataDbContext>()
            .UseSqlite(_connection)
            .Options;

        _dbContext = new HealthDataDbContext(healthDbContextOptions);
        _dbContext.Database.EnsureCreated();

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
            _dbContext.Database.EnsureDeleted();
            _dbContext.Dispose();
            _connection.Close();
            _connection.Dispose();
        }
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
    public async Task DeleteAllHealthMeasureByBatchIdAsyncShouldThrowErrorIfThereIsAttemptToDeletePublishedData()
    {
        // Arrange
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: true)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());
        PopulateDatabase(new HealthMeasureModelHelper(key: 101, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // Act
        var act = async () => await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(1, "batchId1");
        var dbContent = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 1).ToListAsync();

        // Assert
        act.ShouldThrow<InvalidOperationException>()
            .Message.ShouldBe("Error attempting to delete published batch.");
        dbContent.Count.ShouldBe(2);
    }

    [Fact]
    public async Task DeleteAllHealthMeasureByBatchIdAsyncShouldReturnFalseWhenIndicatorIdNotFound()
    {
        // Arrange
        var nonExistentIndicatorId = 2;
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // Act
        var result = await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(nonExistentIndicatorId, "batchId1");
        var populatedIndicator = await _dbContext.HealthMeasure.Where(hm => hm.IndicatorDimension.IndicatorId == 1).ToListAsync();

        // Assert
        result.ShouldBe(false);
        populatedIndicator.Count.ShouldBe(1);
    }

    [Fact]
    public async Task DeleteAllHealthMeasureByBatchIdAsyncShouldReturnFalseWhenBatchIdNotFound()
    {
        // Arrange
        var nonExistentBatchId = "nonExistentBatchId";
        PopulateDatabase(new HealthMeasureModelHelper(key: 100, isPublished: false)
            .WithBatchId("batchId1")
            .WithIndicatorDimension(indicatorId: 1)
            .Build());

        // Act
        var result = await _healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(1, nonExistentBatchId);
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
