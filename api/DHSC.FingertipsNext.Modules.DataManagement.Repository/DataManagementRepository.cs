using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public class DataManagementRepository(DataManagementDbContext dataManagementDbContext) : IDataManagementRepository
{


    private readonly DataManagementDbContext _dbContext =
        dataManagementDbContext ?? throw new ArgumentNullException(nameof(dataManagementDbContext));

    /// <summary>
    ///     Will add the given batch to the batch table
    /// </summary>
    /// <param name="batch"></param>
    /// <returns>TODO: Return the batch?</returns>
    /// <exception cref="NotImplementedException"></exception>
    public async Task<BatchModel> AddBatchAsync(BatchModel batch)
    {
        var model = _dbContext.Batch
            .AddAsync(batch);

        await _dbContext.SaveChangesAsync();

        return batch;
    }
}