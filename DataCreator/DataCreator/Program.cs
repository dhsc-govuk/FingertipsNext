﻿using DataCreator.PholioDatabase;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System.Globalization;
using System.Threading;

namespace DataCreator
{
    internal class Program
    {
        private static async Task Main(string[] args) =>
            await CreateServices().GetRequiredService<DataCreatorApplication>().CreateDataAsync();

        private static ServiceProvider CreateServices()
        {
            var configuration = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json", optional: true, reloadOnChange: true)
                .Build();

            return new ServiceCollection()
                .AddSingleton<IConfiguration>(configuration)
                .AddSingleton<DataCreatorApplication>()
                .AddSingleton<PholioDataFetcher>()
                .AddSingleton<DataManager>()
                .BuildServiceProvider();
        }
    }
}