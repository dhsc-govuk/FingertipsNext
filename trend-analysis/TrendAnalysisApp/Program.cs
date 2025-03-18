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
        var serviceProvider = CreateServices();
        serviceProvider.GetRequiredService<TrendDataProcessor>().Process(serviceProvider).Wait();
    }

    // Sets up the services for the console application
    // Note that the DB Context is transient so that it can be managed on a per thread basis
    // see: https://learn.microsoft.com/en-us/ef/core/dbcontext-configuration/#implicitly-sharing-dbcontext-instances-via-dependency-injection
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
            .AddDbContext<HealthMeasureDbContext>(
                options => options.UseSqlServer(connString),
                ServiceLifetime.Transient
            )
            .AddSingleton<TrendDataProcessor>()
            .AddSingleton<IndicatorRepository>()
            .AddSingleton<TrendCalculator>()
            // The legacy calculator is not threadsafe so is instantiated per thread
            .AddTransient<TrendMarkerCalculator>()
            .AddSingleton<LegacyMapper>()
            .BuildServiceProvider();
    }
}
