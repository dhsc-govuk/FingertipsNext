using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Repository;
namespace TrendAnalysisApp;

internal class Program
{
    static void Main(string[] args)
    {
        CreateServices().GetRequiredService<TrendDataProcessor>().Process();
        
    }

    private static ServiceProvider CreateServices()
    {
        var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        
        return new ServiceCollection()
            .AddSingleton<IConfiguration>(configuration)
            .AddSingleton<TrendDataProcessor>()
            .AddSingleton<HealthMeasureRepository>()
            .BuildServiceProvider();
    }
}
