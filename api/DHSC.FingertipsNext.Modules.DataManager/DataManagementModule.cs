using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Monolith;
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
    }
    
}