using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.Azure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.DataManagement;

public class DataManagementModule : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "DataManagement";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IDataManagementService, DataManagementService>();
        services.AddTransient<IDataManagementRepository, DataManagementRepository>();
        RegisterAzureClients(services, configuration);
    }

    private static void RegisterAzureClients(IServiceCollection services, IConfiguration configuration)
    {
        const string storageConnectionStringEnvVar = "STORAGE_CONNECTION_STRING";
        var storageConnectionString = GetConfigurationValue(configuration, storageConnectionStringEnvVar);

        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(storageConnectionString)
                .ConfigureOptions(options =>
                {
                    options.Retry.MaxRetries = 1;
                });
        });
    }

    private static string GetConfigurationValue(IConfiguration configuration, string key)
    {
        return configuration.GetValue<string>(key) ?? throw new ArgumentException($"Missing configuration value for key '{key}'.");
    }
}