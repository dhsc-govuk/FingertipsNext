
using Microsoft.Data.SqlClient;

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
    private static ILogger<Module> _logger;

    public Module(ILogger<Module> logger)
    {
        _logger = logger;
    }

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IWeatherFactory, WeatherFactory>();
        services.AddTransient<ICoreController, CoreController>();
        services.AddTransient<ICoreService, CoreService>();
        services.AddTransient<ISearchClient, SearchClient>();
        services.AddTransient<IHealthMeasureService, HealthMeasureService>();
        _RegisterDbContext(services, configuration);
    }

    private static void _RegisterDbContext(IServiceCollection services, IConfiguration configuration)
    {
        const string dbServerEnvironmentVariable = "DB_SERVER";
        const string dbNameEnvironmentVariable = "DB_NAME";
        const string dbUserEnvironmentVariable = "DB_USER";
        const string dbPasswordEnvironmentVariable = "DB_PASSWORD";

        var dbServer = configuration.GetValue<string>(dbServerEnvironmentVariable);
        var dbName = configuration.GetValue<string>(dbNameEnvironmentVariable);
        var dbUser = configuration.GetValue<string>(dbUserEnvironmentVariable);
        var dbPassword = configuration.GetValue<string>(dbPasswordEnvironmentVariable);

        if (string.IsNullOrWhiteSpace(dbServer) || string.IsNullOrWhiteSpace(dbName) ||
            string.IsNullOrWhiteSpace(dbUser) || string.IsNullOrWhiteSpace(dbPassword))
        {
            throw new ArgumentException(
                "Invalid environment variables provided. Check DB_SERVER, DB_NAME, DB_USER & DB_PASSWORD have been set appropriately");
        }

        var trustServerCertificate = false;
        trustServerCertificate = configuration.GetValue<bool>("TRUST_CERT");

        if (trustServerCertificate)
        {
            _logger.LogTrustCert();
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = dbServer,
            UserID = dbUser,
            Password = dbPassword,
            InitialCatalog = dbName,
            TrustServerCertificate = trustServerCertificate
        };

        services.AddDbContext<RepositoryDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }
}
