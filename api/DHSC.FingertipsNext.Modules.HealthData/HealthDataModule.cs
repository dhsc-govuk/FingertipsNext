using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.HealthData;

public class HealthDataModule : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "healthdata";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IIndicatorsService, IndicatorService>();
        services.AddTransient<IHealthDataRepository, HealthDataRepository>();
        services.AddSingleton<IHealthDataMapper, HealthDataMapper>();
        RegisterDbContext(services, configuration);
    }

    private static void RegisterDbContext(IServiceCollection services, IConfiguration configuration) 
    {
        services.AddDbContext<HealthDataDbContext>(options => options.UseSqlServer(BuildConnectionString(configuration)));
    }
}