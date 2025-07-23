using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public class DataManagementRepository(DataManagementDbContext dataManagementDbContext) : IDataManagementRepository
{
    private readonly DataManagementDbContext _dbContext =
        dataManagementDbContext ?? throw new ArgumentNullException(nameof(dataManagementDbContext));

    /// <summary>
    ///     Will add the given batch to the batch table
    /// </summary>
    /// <param name="batch"></param>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<BatchModel> AddBatchAsync(BatchModel batch)
    {
        await _dbContext.Batch.AddAsync(batch);
        await _dbContext.SaveChangesAsync();
        return batch;
    }

    /// <summary>
    ///     Get all batches.
    /// </summary>
    /// <returns>All batches in the database.</returns>
    public async Task<IEnumerable<BatchModel>> GetAllBatchesAsync()
    {
        return await _dbContext.Batch.ToListAsync();
    }

    /// <summary>
    ///     Get all batches which are for the specified indicators.
    /// </summary>
    /// <param name="indicators"></param>
    /// <returns>All batches in the database which are for the specified indicators.</returns>
    public async Task<IEnumerable<BatchModel>> GetBatchesByIdsAsync(int[] indicators)
    {
        ArgumentNullException.ThrowIfNull(indicators);

        return await _dbContext.Batch
            .Where(b => indicators.Contains(b.IndicatorId))
            .ToListAsync();
    }

    /// <summary>
    ///     Delete the specified batch.
    /// </summary>
    /// <param name="batchId">The ID of the batch to delete.</param>
    /// <param name="userId">The ID of the user deleting the batch.</param>
    /// <param name="indicatorsThatCanBeModified">The indicator IDs the user has permission to modify.</param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<BatchModel?> DeleteBatchAsync(string batchId, Guid userId, IList<int> indicatorsThatCanBeModified)
    {
        ArgumentException.ThrowIfNullOrEmpty(batchId);
        ArgumentNullException.ThrowIfNull(indicatorsThatCanBeModified);

        // Batch must be unpublished
        var model = await _dbContext.Batch.Where(b => b.BatchId == batchId).FirstOrDefaultAsync();

        if (model == null)
        {
            throw new ArgumentException("BatchNotFound");
        }

        if (indicatorsThatCanBeModified.Any() && !indicatorsThatCanBeModified.Contains(model.IndicatorId))
        {
            throw new ArgumentException("PermissionDenied");
        }

        if (model is { DeletedAt: not null, Status: BatchStatus.Deleted })
        {
            throw new ArgumentException("BatchDeleted");
        }

        if (model.PublishedAt <= DateTime.UtcNow)
        {
            throw new ArgumentException("BatchPublished");
        }

        model.DeletedAt = DateTime.UtcNow;
        model.DeletedUserId = userId;
        model.Status = BatchStatus.Deleted;
        await _dbContext.SaveChangesAsync();
        return model;
    }
}