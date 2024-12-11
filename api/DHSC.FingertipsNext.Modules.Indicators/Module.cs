using DHSC.FingertipsNext.Modules.Indicators.Services;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Indicators;

public class Module  : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "indicators";
    
    public override void RegisterModule(IServiceCollection services)
    {
        services.AddTransient<IIndicatorsService, IndicatorService>();
        services.AddTransient<IIndicatorsDataProvider, IndicatorDataProvider>();
    }
}