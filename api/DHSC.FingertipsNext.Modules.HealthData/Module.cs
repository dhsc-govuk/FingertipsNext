using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.HealthData;

public class Module  : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "healthdata";
    
    public override void RegisterModule(IServiceCollection services)
    {
        services.AddTransient<IIndicatorsService, IndicatorService>();
        services.AddTransient<IIndicatorsDataProvider, IndicatorDataProvider>();
    }
}