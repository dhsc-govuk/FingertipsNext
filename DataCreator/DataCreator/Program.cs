using DataCreator;
using DataCreator.PholioDatabase;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;


namespace MyApp
{
    internal class Program
    {
        private static async Task Main(string[] args)
        {
            var services = CreateServices();

            var app = services.GetRequiredService<DataCreatorApplication>();
            await app.CreateDataAsync();
        }

        private static ServiceProvider CreateServices()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .AddEnvironmentVariables()
                .Build();


            var serviceProvider = new ServiceCollection()
                .AddSingleton<IConfiguration>(configuration)
                .AddSingleton<DataCreatorApplication>()
                .AddSingleton<PholioDataFetcher>()
                .AddSingleton<PostcodeFetcher>()
                .AddSingleton<DataFileWriter>()
                .AddSingleton<DataManager>()
                .BuildServiceProvider();

            return serviceProvider;
        }
    }

    
}