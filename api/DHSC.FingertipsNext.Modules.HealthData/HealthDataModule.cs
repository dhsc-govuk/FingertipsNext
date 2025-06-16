using System.Net.Http.Headers;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Modules.HealthData.Mappings;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Azure;

namespace DHSC.FingertipsNext.Modules.HealthData;

public class HealthDataModule : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "healthdata";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IIndicatorsService, IndicatorService>();
        services.AddTransient<IHealthDataRepository, HealthDataRepository>();
        services.AddSingleton<IHealthDataMapper, HealthDataMapper>();
        services.AddTransient<IValidationService, CsvValidationService>();
        RegisterDbContext(services, configuration);
        RegisterAzureClients(services, configuration);
        RegisterHttpClient(services, configuration);
    }
    
    private static void RegisterAzureClients(IServiceCollection services, IConfiguration configuration)
    {
        const string storageContainerConnectionStringEnvVar = "STORAGE_CONTAINER_CONNECTION_STRING";
        var storageContainerConnectionString = GetEnvironmentValue(configuration, storageContainerConnectionStringEnvVar);
            
        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(storageContainerConnectionString)
                .ConfigureOptions(options =>
                {
                    options.Retry.MaxRetries = 1;
                });

            // DefaultAzureCredential credential = new();
            // clientBuilder.UseCredential(credential);
        });
    }

    private static void RegisterHttpClient(IServiceCollection services, IConfiguration configuration)
    {
        const string storageContainerUrlEnvVar = "STORAGE_CONTAINER_URL";
        const string storageContainerNameEnvVar = "STORAGE_CONTAINER_NAME";
        const string storageAccountNameEnvVar = "STORAGE_ACCOUNT_NAME";
        const string storageAccountKeyEnvVar = "STORAGE_ACCOUNT_KEY";
        
        var storageContainerUrl = GetEnvironmentValue(configuration, storageContainerUrlEnvVar);
        var storageContainerName = GetEnvironmentValue(configuration, storageContainerNameEnvVar);
        var storageAccountName = GetEnvironmentValue(configuration, storageAccountNameEnvVar);
        var  storageAccountKey = GetEnvironmentValue(configuration, storageAccountKeyEnvVar);
        
        services.AddHttpClient<IDataUploadService, DataUploadService>(client =>
        {
            client.BaseAddress = new Uri($"{storageContainerUrl}/{storageContainerName}");
            client.DefaultRequestHeaders.Authorization = 
                AuthenticationHeaderValue.Parse($"SharedKey {storageAccountName}:{storageAccountKey}");
            client.DefaultRequestHeaders.Add("x-ms-date", DateTimeOffset.UtcNow.ToString("R"));
            client.DefaultRequestHeaders.Add("x-ms-version", "2015-02-21");
            client.DefaultRequestHeaders.Add("x-ms-blob-type", "BlockBlob");
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

        services.AddDbContext<HealthDataDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }

    private static string GetEnvironmentValue(IConfiguration configuration, string name) =>
        configuration.GetValue<string>(name) ?? throw new ArgumentException($"Invalid environment variables provided. Check {name} has been set appropriately");
}