using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.DataManagement.Repository;

public class DataManagementDbContext : DbContext
{
    public DataManagementDbContext()
    {
    }
    
    public DataManagementDbContext(DbContextOptions<DataManagementDbContext> options) : base(options)
    {
    }
    
    public DbSet<BatchModel> Batch { get; set; }

}