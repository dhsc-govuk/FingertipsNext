using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Area;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "area";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IAreaService, AreaService>();
    }
}
