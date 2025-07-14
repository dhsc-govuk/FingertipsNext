using DHSC.FingertipsNext.Modules.UserAuth.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.UserAuth.Repository;

public class UserAuthDbContext : DbContext
{
    public UserAuthDbContext()
    {
    }

    public UserAuthDbContext(DbContextOptions<UserAuthDbContext> options)
        : base(options)
    {
    }

    public DbSet<IndicatorRole> IndicatorRoles { get; set; }

    protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
    {
        ArgumentNullException.ThrowIfNull(optionsBuilder);

        optionsBuilder.UseQueryTrackingBehavior(QueryTrackingBehavior.NoTrackingWithIdentityResolution);
    }
}
