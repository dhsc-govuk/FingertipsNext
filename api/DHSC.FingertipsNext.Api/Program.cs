using System.Text.Json;
using Asp.Versioning;
using DHSC.Fingertips.Monolith;
using Scalar.AspNetCore;

namespace DHSC.FingerTipsNext.Api;

public static class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddControllers().AddControllersAsServices();
        
        builder.Services.AddOpenApi()       
            .AddApiVersioning(options =>
            {
                options.AssumeDefaultVersionWhenUnspecified = true;
                options.DefaultApiVersion = new ApiVersion(1, 0);
                options.ReportApiVersions = true;
                options.ApiVersionReader = ApiVersionReader.Combine(
                    new UrlSegmentApiVersionReader(),
                    new QueryStringApiVersionReader("api-version"),
                    new HeaderApiVersionReader("X-Version"),
                    new MediaTypeApiVersionReader("X-Version"));
            })
            .AddApiExplorer(options =>
            {
                options.GroupNameFormat = "'v'VVV";
                options.SubstituteApiVersionInUrl = true;
            });

        RegisterModules(builder.Services, builder.Configuration);

        var app = builder.Build();

        app.MapOpenApi();
        
        if (app.Environment.IsDevelopment())
        {
            app.MapScalarApiReference(options =>
            {
                options
                    .WithTitle("Fingertips Next API")
                    .WithDownloadButton(true)
                    .WithTheme(ScalarTheme.Purple)
                    .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Axios);
            });
        }

        app.UseHttpsRedirection();

        app.UseAuthorization();

        app.MapControllers();

        app.Run();
    }

    private static void RegisterModules(IServiceCollection services, ConfigurationManager configuration)
    {
        var type = typeof(IMonolithModule);
        var types = AppDomain.CurrentDomain.GetAssemblies()
            .SelectMany(s => s.GetTypes())
            .Where(t => type.IsAssignableFrom(t) && t != type && !t.IsAbstract)
            .ToList();
        
        types.ForEach(x =>
        {
            var module = Activator.CreateInstance(x) as IMonolithModule;
            module?.RegisterModule(services);
            module?.RegisterConfiguration(configuration);
        });
    }
}