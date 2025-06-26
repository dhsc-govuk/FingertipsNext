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
        services.AddLogging();
        services.AddSingleton(TimeProvider.System);
        services.AddTransient<IDataManagementService, DataManagementService>();
        services.AddTransient<IDataManagementRepository, DataManagementRepository>();
        RegisterAzureClients(services, configuration);
    }

    private static void RegisterAzureClients(IServiceCollection services, IConfiguration configuration)
    {
        var storageConnectionString = configuration.GetConnectionString("UploadStorageAccount")
            ?? throw new ArgumentException("UploadStorageAccount connection string not set");

        services.AddAzureClients(clientBuilder =>
        {
            clientBuilder.AddBlobServiceClient(storageConnectionString)
                .ConfigureOptions(options =>
                {
                    options.Retry.MaxRetries = 2;
                });
        });
    }
}