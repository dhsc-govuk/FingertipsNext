using DHSC.FingertipsNext.Modules.Indicators.Controllers.V1;
using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Indicators;

public class Module  : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "indicators";
    
    public override void RegisterModule(IServiceCollection services)
    {
        services.AddTransient<IIndicatorsController, IndicatorsController>();
    }
}