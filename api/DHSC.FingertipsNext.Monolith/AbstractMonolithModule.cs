using System.Diagnostics;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Monolith;

public abstract class AbstractMonolithModule : IMonolithModule
{
    public virtual string ModuleName => throw new System.NotImplementedException();
    public void RegisterConfiguration(IConfigurationBuilder configurationBuilder)
    {
        var pathToExe = Process.GetCurrentProcess().MainModule?.FileName;
        var pathToContentRoot = Path.GetDirectoryName(pathToExe);
        var environment= Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT");
        
        var config = new ConfigurationBuilder()
            .SetBasePath(pathToContentRoot ?? string.Empty)
            .AddJsonFile($"appsettings.{ModuleName}.module.json", optional: true, reloadOnChange: true)
            .AddJsonFile($"appsettings.{ModuleName}.module.{environment}.json", optional: true, reloadOnChange: true)
            .Build();
        configurationBuilder.AddConfiguration(config);
    }

    public abstract void RegisterModule(IServiceCollection services);
}