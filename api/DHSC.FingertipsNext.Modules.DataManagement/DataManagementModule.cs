using Azure.Identity;
using Azure.Storage;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.DataManagement;

public class DataManagementModule : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "DataManagement";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddLogging();
        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IDataManagementService, DataManagementService>();
        services.AddTransient<IDataManagementRepository, DataManagementRepository>();
        RegisterAzureClients(services, configuration);
        RegisterDbContext(services, configuration);
    }

    private static void RegisterAzureClients(IServiceCollection services, IConfiguration configuration)
    {
        var storageUri = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_URI");
        ArgumentNullException.ThrowIfNull(storageUri);

        var userAssignedManagedIdentityClientId =
            configuration.GetValue<string>("USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID");

        var storageAccountName = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_NAME");
        var storageAccountKey = configuration.GetValue<string>("UPLOAD_STORAGE_ACCOUNT_KEY");

        services.AddAzureClients(clientBuilder =>
        {
            if (!string.IsNullOrEmpty(userAssignedManagedIdentityClientId))
            {
                clientBuilder.AddBlobServiceClient(new Uri(storageUri))
                    .ConfigureOptions(options =>
                    {
                        options.Retry.MaxRetries = 2;
                    });

                var credential = new DefaultAzureCredential(
                    new DefaultAzureCredentialOptions { ManagedIdentityClientId = userAssignedManagedIdentityClientId }
                    );
                clientBuilder.UseCredential(credential);
            }
            else if (!string.IsNullOrEmpty(storageAccountName) && !string.IsNullOrEmpty(storageAccountKey))
            {
                clientBuilder.AddBlobServiceClient(new Uri(storageUri),
                        new StorageSharedKeyCredential(storageAccountName, storageAccountKey))
                    .ConfigureOptions(options =>
                    {
                        options.Retry.MaxRetries = 2;
                    });
            }
            else
            {
                throw new ArgumentException(
                    "Either USER_ASSIGNED_MANAGED_IDENTITY_CLIENT_ID or UPLOAD_STORAGE_ACCOUNT_NAME and UPLOAD_STORAGE_ACCOUNT_KEY must be specified.");
            }
        });
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

        var trustServerCertificate = configuration.GetValue<bool>("TRUST_CERT");

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
        services.AddDbContext<DataManagementDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }

    private static string GetEnvironmentValue(IConfiguration configuration, string name) =>
        configuration.GetValue<string>(name) ?? throw new ArgumentException($"Invalid environment variables provided. Check {name} has been set appropriately");
}