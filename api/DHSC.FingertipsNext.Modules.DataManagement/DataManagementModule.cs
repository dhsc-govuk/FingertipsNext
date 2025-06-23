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
        const string storageContainerConnectionStringEnvVar = "UPLOAD_STORAGE_ACCOUNT_CONNECTION_STRING";
        var storageContainerConnectionString = configuration.GetValue<string>(storageContainerConnectionStringEnvVar);

        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(storageContainerConnectionString)
                .ConfigureOptions(options =>
                {
                    options.Retry.MaxRetries = 1;
                });
        });
    }

}