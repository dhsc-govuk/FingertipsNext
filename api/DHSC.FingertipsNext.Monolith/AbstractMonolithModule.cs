using System.Diagnostics;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Monolith;

public abstract class AbstractMonolithModule : IMonolithModule
{
    public abstract string ModuleName { get; }

    public void RegisterConfiguration(IConfigurationBuilder configurationBuilder)
    {
        var pathToExe = Process.GetCurrentProcess().MainModule?.FileName;
        var pathToContentRoot = Path.GetDirectoryName(pathToExe);
        var environment = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");

        var config = new ConfigurationBuilder()
            .SetBasePath(pathToContentRoot ?? string.Empty)
            .AddJsonFile($"appsettings.{ModuleName}.module.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{ModuleName}.module.{environment}.json", optional: true, reloadOnChange: true)
            .Build();
        configurationBuilder.AddConfiguration(config);
    }

    public abstract void RegisterModule(IServiceCollection services, IConfiguration configuration);

    private static string GetEnvironmentValue(IConfiguration configuration, string name) =>
        configuration.GetValue<string>(name) ?? throw new ArgumentException($"Invalid environment variables provided. Check {name} has been set appropriately");

    protected static string BuildConnectionString(IConfiguration configuration)
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

#if DEBUG
        trustServerCertificate = configuration.GetValue<bool>("TRUST_CERT");

        if (trustServerCertificate)
        {
            Console.WriteLine("Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!");
        }
#endif

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = dbServer,
            UserID = dbUser,
            Password = dbPassword,
            InitialCatalog = dbName,
            TrustServerCertificate = trustServerCertificate
        };

        return builder.ConnectionString;
    }
}