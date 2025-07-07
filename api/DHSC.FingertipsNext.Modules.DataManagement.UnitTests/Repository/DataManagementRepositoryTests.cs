using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using Microsoft.EntityFrameworkCore;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Repository;

public class DataManagementRepositoryTests : IDisposable
{
    private readonly DataManagementDbContext _dbContext;
    private DataManagementRepository _dataManagementRepository;

    public DataManagementRepositoryTests()
    {
        DbContextOptionsBuilder<DataManagementDbContext> dbOptions = new DbContextOptionsBuilder<DataManagementDbContext>().UseInMemoryDatabase(
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
    public void RepositoryInitialisationShouldThrowErrorIfNullDBContextIsProvided()
    {
        var act = () => _dataManagementRepository = new DataManagementRepository(null!);

        act.ShouldThrow<ArgumentNullException>()
            .Message.ShouldBe("Value cannot be null. (Parameter 'dataManagementDbContext')");
    }

    [Fact]
    public async Task RepositoryAddBatch()
    {
        // Arrange
        var batchId = "1234_2025-01-01T00:00:00.000";
        BatchModel model = new BatchModel
        {
            BatchId = batchId,
            IndicatorId = 1234,
            Created = new DateTime(2025, 1, 1, 0, 0, 0),
            PublishedAt = new DateTime(2025, 1, 1, 0, 0, 0),
            UserId = Guid.Parse("5d4a9f8c-582c-42a7-9447-0d568466806e"),
            Status = BatchStatus.Received,
        };

        // Act
        await _dataManagementRepository.AddBatchAsync(model);

        // Assert
        var batch = await _dbContext.Batch.Where(b => b.BatchId == batchId).FirstOrDefaultAsync();
        batch.ShouldNotBeNull();
        batch.ShouldBeEquivalentTo(model);
    }
}