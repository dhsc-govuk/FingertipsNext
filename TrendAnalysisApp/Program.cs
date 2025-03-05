using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TrendAnalysisApp.Repository;
namespace TrendAnalysisApp;

internal class Program
{
    static void Main(string[] args)
    {
        CreateServices().GetRequiredService<TrendDataProcessor>().Process().Wait();
    }

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
            .AddSingleton<HealthMeasureRepository>()
            .BuildServiceProvider();
    }
}
