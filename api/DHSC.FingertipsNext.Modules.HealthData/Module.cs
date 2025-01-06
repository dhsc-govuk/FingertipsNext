using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.HealthData;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "healthdata";
    
    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IIndicatorsService, IndicatorService>();
        services.AddTransient<IIndicatorsDataProvider, IndicatorDataProvider>();
        services.AddTransient<IRepository, HealthDataRepository>();
        services.AddAutoMapper(typeof(AutoMapperProfiles));
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
            Console.WriteLine("Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!");
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = dbServer,
            UserID = dbUser,
            Password = dbPassword,
            InitialCatalog = dbName,
            TrustServerCertificate = trustServerCertificate
        };

        services.AddDbContext<HealthMeasureDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }
}