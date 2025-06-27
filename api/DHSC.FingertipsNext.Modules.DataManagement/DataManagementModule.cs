using Azure.Identity;
using Azure.Storage;
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
                clientBuilder.AddBlobServiceClient(new Uri(storageUri), new ManagedIdentityCredential(ManagedIdentityId.FromUserAssignedClientId(userAssignedManagedIdentityClientId)))
                    .ConfigureOptions(options =>
                    {
                        options.Retry.MaxRetries = 2;
                    });
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
}