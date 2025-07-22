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

    public async Task<BatchModel?> DeleteBatchAsync(string batchId, Guid userId)
    {
        ArgumentException.ThrowIfNullOrEmpty(batchId);

        // Batch must be unpublished
        var model = await _dbContext.Batch.Where(b => b.BatchId == batchId).FirstOrDefaultAsync();

        if (model == null)
        {
            throw new ArgumentException($"BatchNotFound");
        }

        if (model.DeletedAt != null && model.Status == BatchStatus.Deleted)
        {
            throw new ArgumentException($"BatchDeleted");
        }

        if (model.PublishedAt <= DateTime.UtcNow)
        {
            throw new ArgumentException($"BatchPublished");
        }

        model.DeletedAt = DateTime.UtcNow;
        model.DeletedUserId = userId;
        model.Status = BatchStatus.Deleted;
        await _dbContext.SaveChangesAsync();
        return model;
    }
}