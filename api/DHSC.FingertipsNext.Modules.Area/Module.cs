using AutoMapper;
using DHSC.FingertipsNext.Modules.Area.Repository;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using DHSC.FingertipsNext.Monolith;
using Microsoft.Data.SqlClient;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area;

public class Module : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "area";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {
        services.AddTransient<IAreaService, AreaService>();
        services.AddTransient<IAreaRepository, AreaRepository>();
        
        services.AddAutoMapper(typeof(AutoMapperProfiles));
        
        RegisterDbContext(services, configuration);
    }
    
    private static void RegisterDbContext(IServiceCollection services, IConfiguration configuration)
    {
        var trustServerCertificate = false;
        trustServerCertificate = configuration.GetValue<bool>("TRUST_CERT");

        if (trustServerCertificate)
        {
            Console.WriteLine("Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!");
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = GetEnvironmentValue(configuration, "DB_SERVER"),
            UserID = GetEnvironmentValue(configuration, "DB_USER"),
            Password = GetEnvironmentValue(configuration, "DB_PASSWORD"),
            InitialCatalog = GetEnvironmentValue(configuration, "DB_NAME"),
            TrustServerCertificate = trustServerCertificate
        };

        services.AddDbContext<AreaRepositoryDbContext>(options => options.UseSqlServer(builder.ConnectionString));
    }

    private static string GetEnvironmentValue(IConfiguration configuration, string name) =>
        configuration.GetValue<string>(name) ?? throw new ArgumentException($"Invalid environment variables provided. Check {name} has been set appropriately");
}

public class AutoMapperProfiles : Profile
{
    public AutoMapperProfiles()
    {
        CreateMap<AreaDimensionModel, AreaWithRelations>();
    }
}