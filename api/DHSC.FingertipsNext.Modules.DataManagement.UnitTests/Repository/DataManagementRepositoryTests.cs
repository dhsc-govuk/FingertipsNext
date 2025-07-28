using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.UnitTests.TestData;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Repository;

public class DataManagementRepositoryTests : IDisposable
{
    private const string UserId = "88011af4-fda1-4ae0-bbeb-c6f6cd8179ae";

    private readonly BatchModel _batchFor22401 = BatchExamples.BatchModel with
    {
        BatchId = "22401_2017-06-30T14:22:37.123Z",
        IndicatorId = 22401,
        PublishedAt = DateTime.UtcNow.AddYears(1)
    };

    private readonly BatchModel _batchFor383 = BatchExamples.BatchModel with
    {
        BatchId = "383_2017-06-30T14:22:37.123Z",
        IndicatorId = 383,
        Status = BatchStatus.Deleted,
        PublishedAt = DateTime.UtcNow.AddYears(1)
    };

    private readonly BatchModel _batchFor41101 = BatchExamples.BatchModel with
    {
        BatchId = "41101_2020-03-07T14:22:37.123Z",
        IndicatorId = 41101,
        CreatedAt = new DateTime(2028, 2, 29, 12, 00, 00),
        PublishedAt = new DateTime(2028, 2, 29, 12, 00, 00)
    };

    private readonly DataManagementRepository _dataManagementRepository;

    private readonly DataManagementDbContext _dbContext;

    public DataManagementRepositoryTests()
    {
        var dbOptions =
            new DbContextOptionsBuilder<DataManagementDbContext>().UseInMemoryDatabase(
                Guid.NewGuid().ToString()
            );

        _dbContext = new DataManagementDbContext(dbOptions.Options);
        _dataManagementRepository = new DataManagementRepository(_dbContext);
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
    public async Task GetBatchesByIdsAsyncShouldReturnBatchesForSpecifiedIndicators()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesByIdsAsync([41101, 383, 22401]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.Count.ShouldBe(3);
        batchModels.ShouldContain(_batchFor41101);
        batchModels.ShouldContain(_batchFor383);
        batchModels.ShouldContain(_batchFor22401);
    }

    [Fact]
    public async Task GetBatchesByIdsAsyncShouldReturnNoBatchesIfNoDataForSpecifiedIndicators()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesByIdsAsync([1234, 5678]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetBatchesAsyncShouldReturnNoBatchesIfNoIndicatorsSpecified()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesByIdsAsync([]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetBatchesByIdsAsyncShouldThrowAnExceptionIfANullListOfIndicatorsIsSpecified()
    {
        await _dataManagementRepository.GetBatchesByIdsAsync(null!).ShouldThrowAsync(typeof(ArgumentNullException));
    }

    [Fact]
    public async Task GetAllBatchesAsyncShouldReturnAllBatches()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetAllBatchesAsync();

        // Assert
        var batchModels = batches.ToList();
        batchModels.Count.ShouldBe(3);
        batchModels.ShouldContain(_batchFor41101);
        batchModels.ShouldContain(_batchFor383);
        batchModels.ShouldContain(_batchFor22401);
    }

    [Fact]
    public async Task EnsureBatchIsSoftDeleted()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383);
        await _dbContext.SaveChangesAsync();

        // Act
        var success = await _dataManagementRepository.DeleteBatchAsync(_batchFor383, UserId);

        // Assert
        success.ShouldNotBeNull();
        success.BatchId.ShouldBeEquivalentTo(_batchFor383.BatchId);
        success.IndicatorId.ShouldBeEquivalentTo(_batchFor383.IndicatorId);

        var batches = await _dataManagementRepository.GetBatchesByIdsAsync([383, 41101]);
        var batchModels = batches.ToList();
        var batch383 = batchModels.FirstOrDefault(b => b.IndicatorId == 383);
        batch383.DeletedAt.ShouldNotBe(null);
        batch383.DeletedUserId.ShouldBe(UserId);
        batch383.Status.ShouldBe(BatchStatus.Deleted);

        // Ensure the 41101 batch still exists
        var batch41101 = batchModels.FirstOrDefault(b => b.IndicatorId == 41101);
        batch41101.Status.ShouldNotBe(BatchStatus.Deleted);
        batch41101.DeletedAt.ShouldBeNull();
        batch41101.DeletedUserId.ShouldBeNull();
    }

    [Fact]
    public async Task DeleteBatchAsyncShouldThrowAnExceptionIfANullModelIsSpecified()
    {
        await _dataManagementRepository.DeleteBatchAsync(null!, UserId)
            .ShouldThrowAsync(typeof(ArgumentNullException));
    }
}