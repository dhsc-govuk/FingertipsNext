using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public class DataManagementRepository(DataManagementDbContext dataManagementDbContext) : IDataManagementRepository
{
    
    
    private readonly DataManagementDbContext _dbContext =
        dataManagementDbContext ?? throw new ArgumentNullException(nameof(dataManagementDbContext));
    
    public string SayHello()
    {
        return "I'm a Repository";
    }

    /// <summary>
    ///     Will add the given batch to the batch table
    /// </summary>
    /// <param name="batch"></param>
    /// <returns>TODO: Return the batch?</returns>
    /// <exception cref="NotImplementedException"></exception>
    public Task<BatchModel> AddBatchAsync(BatchModel batch)
    {
        var model =  _dbContext.Batch
            .AddAsync(batch);
        
        throw new NotImplementedException();
    }
}