using DHSC.FingertipsNext.Modules.Search.Controllers.V1;
using DHSC.FingertipsNext.Modules.Search.ModuleInterfaces;
using DHSC.FingertipsNext.Monolith;

namespace DHSC.FingertipsNext.Modules.Search;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "search";
    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<ISearchController, SearchController>();
    }
}