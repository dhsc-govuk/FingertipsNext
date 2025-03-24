using DHSC.FingertipsNext.Modules.Area.Controllers;
using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Area;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "area";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IAreaService, AreaService>();
        services.AddTransient<IAreaRepository, AreaRepository>();
        services.AddTransient<IAreaModuleConfig, AreaModuleConfig>();

        AreaService.RegisterMappings(services);
        RegisterDbContext(services, new AreaModuleConfig(configuration));
    }

    private static void RegisterDbContext(IServiceCollection services, IAreaModuleConfig configuration)
    {
        if (configuration.TrustServerCertificate)
        {
            Console.WriteLine(
                "Module:Area: Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!"
            );
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = configuration.DataSource,
            UserID = configuration.UserId,
            Password = configuration.Password,
            InitialCatalog = configuration.InitialCatalog,
            TrustServerCertificate = configuration.TrustServerCertificate,
        };

        services.AddDbContext<AreaRepositoryDbContext>
        (
            options => options.UseSqlServer(builder.ConnectionString)
        );
    }
}
