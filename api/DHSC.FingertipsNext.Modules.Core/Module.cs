namespace DHSC.FingertipsNext.Modules.Core;

using DHSC.FingertipsNext.Modules.Core.Controllers.V1;
using DHSC.FingertipsNext.Modules.Core.ModuleInterfaces;
using DHSC.FingertipsNext.Modules.Core.SearchAPI;
using DHSC.FingertipsNext.Modules.Core.Service;
using DHSC.FingertipsNext.Monolith;
using System.Diagnostics.CodeAnalysis;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "core";

    public override void RegisterModule(IServiceCollection services)
    {
        services.AddTransient<IWeatherFactory, WeatherFactory>();
        services.AddTransient<ICoreController, CoreController>();
        services.AddTransient<ICoreService, CoreService>();
        services.AddTransient<ISearchClient, SearchClient>();
        services.AddTransient<IHealthMeasureService, HealthMeasureService>();
    }
}