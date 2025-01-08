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
        RegisterDbContext(services, configuration);
    }

    private static void RegisterDbContext(IServiceCollection services, IConfiguration configuration)
    {
        const string dbServerEnvironmentVariable = "DB_SERVER";
        const string dbNameEnvironmentVariable = "DB_NAME";
        const string dbUserEnvironmentVariable = "DB_USER";
        const string dbPasswordEnvironmentVariable = "DB_PASSWORD";

        var dbServer = GetEnvironmentValue(configuration, dbServerEnvironmentVariable);
        var dbName = GetEnvironmentValue(configuration, dbNameEnvironmentVariable);
        var dbUser = GetEnvironmentValue(configuration, dbUserEnvironmentVariable);
        var dbPassword = GetEnvironmentValue(configuration, dbPasswordEnvironmentVariable);

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

        services.AddDbContext<HealthDataDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }

    private static string GetEnvironmentValue(IConfiguration configuration, string name) =>
        configuration.GetValue<string>(name) ?? throw new ArgumentException($"Invalid environment variables provided. Check {name} has been set appropriately");
}