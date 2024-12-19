
namespace DHSC.FingertipsNext.Modules.Core;

using Microsoft.EntityFrameworkCore;
using DHSC.FingertipsNext.Modules.Core.Controllers.V1;
using DHSC.FingertipsNext.Modules.Core.ModuleInterfaces;
using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Core.SearchAPI;
using DHSC.FingertipsNext.Modules.Core.Service;
using DHSC.FingertipsNext.Monolith;
using System.Diagnostics.CodeAnalysis;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "core";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IWeatherFactory, WeatherFactory>();
        services.AddTransient<ICoreController, CoreController>();
        services.AddTransient<ICoreService, CoreService>();
        services.AddTransient<ISearchClient, SearchClient>();
        services.AddTransient<IHealthMeasureService, HealthMeasureService>();
        _RegisterDbContext(services, configuration);
    }
    private void _RegisterDbContext(IServiceCollection services, IConfiguration configuration)
    {
        // why don't we just store the connection string as the env variable instead of the bits

        const string dbNameEnvironmentVariable = "DB_NAME";
        const string dbUserEnvironmentVariable = "DB_USER";
        const string dbPasswordEnvironmentVariable = "DB_PASSWORD";

            var dbName = configuration.GetValue<string>(dbNameEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbName))
        {
            throw new InvalidOperationException($"Environment variable {dbNameEnvironmentVariable} must be set");
        }

        var dbUser = configuration.GetValue<string>(dbUserEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbUser))
        {
            throw new InvalidOperationException($"Environment variable {dbUserEnvironmentVariable} must be set");
        }

        var dbPassword = configuration.GetValue<string>(dbPasswordEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbPassword))
        {
            throw new InvalidOperationException($"Environment variable {dbPasswordEnvironmentVariable} must be set");
        }

        var connectionString = $"Server=host.docker.internal,1433;Database={dbName};User Id={dbUser};Password={dbPassword};TrustServerCertificate=Yes;";
        
        Console.WriteLine(connectionString);

        services.AddDbContext<RepositoryDbContext>(options => options.UseSqlServer(connectionString));
    }
}