using DHSC.FingertipsNext.Modules.Search.Controllers.V1;
using DHSC.FingertipsNext.Modules.Search.Interfaces;
using DHSC.FingertipsNext.Monolith;

namespace DHSC.FingertipsNext.Modules.Search;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "search";
    public override void RegisterModule(IServiceCollection services)
    {
        services.AddTransient<ISearchController, SearchController>();
    }
}