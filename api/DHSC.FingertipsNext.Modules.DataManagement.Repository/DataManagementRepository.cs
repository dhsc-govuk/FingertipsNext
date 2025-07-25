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
    /// <param name="model"></param>
    /// <param name="userId">The ID of the user deleting the batch.</param>
    /// <returns></returns>
    /// <exception cref="ArgumentException"></exception>
    public async Task<BatchModel?> DeleteBatchAsync(BatchModel model, string userId)
    {
        ArgumentNullException.ThrowIfNull(model);

        model.DeletedAt = DateTime.UtcNow;
        model.DeletedUserId = userId;
        model.Status = BatchStatus.Deleted;
        await _dbContext.SaveChangesAsync();
        return model;
    }

    public async Task<BatchModel?> GetBatchByIdAsync(string batchId)
    {
        return await _dbContext.Batch.Where(b => b.BatchId == batchId).FirstOrDefaultAsync();
    }
}