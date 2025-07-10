using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Repository;

public class DataManagementRepositoryTests : IDisposable
{
    private const string OriginalFilename = "upload.csv";
    private static readonly DateTime CreatedAt = new(2025, 1, 1, 0, 0, 0);
    private static readonly DateTime PublishedAt = new(2025, 2, 1, 0, 0, 0);
    private static readonly Guid UserId = Guid.NewGuid();

    private readonly BatchModel _batchFor22401 = new()
    {
        BatchKey = 3,
        BatchId = "22401_2017-06-30T14:22:37.123Z",
        IndicatorId = 22401,
        CreatedAt = CreatedAt,
        OriginalFileName = OriginalFilename,
        PublishedAt = PublishedAt,
        UserId = UserId,
        Status = BatchStatus.Received
    };

    private readonly BatchModel _batchFor383 = new()
    {
        BatchKey = 2,
        BatchId = "383_2017-06-30T14:22:37.123Z",
        IndicatorId = 383,
        CreatedAt = CreatedAt,
        OriginalFileName = OriginalFilename,
        PublishedAt = PublishedAt,
        UserId = UserId,
        Status = BatchStatus.Deleted
    };

    private readonly BatchModel _batchFor41101 = new()
    {
        BatchKey = 1,
        BatchId = "41101_2020-03-07T14:22:37.123Z",
        IndicatorId = 41101,
        CreatedAt = CreatedAt,
        OriginalFileName = OriginalFilename,
        PublishedAt = PublishedAt,
        UserId = UserId,
        Status = BatchStatus.Received
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
        if (disposing) _dbContext.Dispose();
    }

    [Fact]
    public async Task GetBatchesAsyncShouldReturnBatchesForSpecifiedIndicators()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesAsync([41101, 383, 22401]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.Count.ShouldBe(3);
        batchModels.ShouldContain(_batchFor41101);
        batchModels.ShouldContain(_batchFor383);
        batchModels.ShouldContain(_batchFor22401);
    }

    [Fact]
    public async Task GetBatchesAsyncShouldReturnNoBatchesIfNoDataForSpecifiedIndicators()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesAsync([1234, 5678]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.ShouldBeEmpty();
    }

    [Fact]
    public async Task GetBatchesAsyncShouldReturnAllBatchesIfNoIndicatorsSpecified()
    {
        // Arrange
        await _dbContext.Batch.AddRangeAsync(_batchFor41101, _batchFor383, _batchFor22401);
        await _dbContext.SaveChangesAsync();

        // Act
        var batches = await _dataManagementRepository.GetBatchesAsync([]);

        // Assert
        var batchModels = batches.ToList();
        batchModels.Count.ShouldBe(3);
        batchModels.ShouldContain(_batchFor41101);
        batchModels.ShouldContain(_batchFor383);
        batchModels.ShouldContain(_batchFor22401);
    }

    [Fact]
    public async Task GetBatchesAsyncShouldThrowAnExceptionIfANullListOfIndicatorsSpecified()
    {
        await _dataManagementRepository.GetBatchesAsync(null!).ShouldThrowAsync(typeof(ArgumentNullException));
    }
}