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
    ///     Get all batches which are for the specified indicators.
    /// </summary>
    /// <param name="indicators"></param>
    /// <returns></returns>
    public async Task<IEnumerable<BatchModel>> GetBatchesAsync(int[] indicators)
    {
        ArgumentNullException.ThrowIfNull(indicators);

        IQueryable<BatchModel> batchDbSet = _dbContext.Batch;
        if (indicators.Length > 0) batchDbSet = batchDbSet.Where(b => indicators.Contains(b.IndicatorId));
        return await batchDbSet.ToListAsync();
    }
}