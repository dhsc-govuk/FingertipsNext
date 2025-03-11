using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Calculator;
using TrendAnalysisApp.Calculator.Legacy;
using TrendAnalysisApp.Mapper;
using TrendAnalysisApp.Repository;
namespace TrendAnalysisApp;

internal static class Program
{
    static void Main(string[] args)
    {
        CreateServices().GetRequiredService<TrendDataProcessor>().Process().Wait();
    }

    // Note this the DB Context and HealthMeasureRepository are not currently threadsafe for parallel execution.
    // DB changes are async and awaited on an indicator by indicator basis, which is more than fast enough for PoC.
    // If we want to make this change in future, we will need to scope them to each thread.
    private static ServiceProvider CreateServices()
    {
        var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();
        var connString = configuration.GetConnectionString(Constants.Database.FingertipsDbName);
        
        return new ServiceCollection()
            .AddSingleton<IConfiguration>(configuration)
            .AddDbContext<HealthMeasureDbContext>(options => options.UseSqlServer(connString))
            .AddSingleton<TrendDataProcessor>()
            .AddSingleton<IndicatorRepository>()
            .AddSingleton<HealthMeasureRepository>()
            .AddSingleton<TrendCalculator>()
            .AddSingleton<TrendMarkerCalculator>()
            .AddSingleton<LegacyMapper>()
            .BuildServiceProvider();
    }
}
