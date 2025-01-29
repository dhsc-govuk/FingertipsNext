using DotNetEnv;

namespace DHSC.FingertipsNext.Api;

using Asp.Versioning;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using DHSC.FingertipsNext.Monolith;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Scalar.AspNetCore;

public static class Program
{
    private static readonly string ApplicationInsightsConnectionString = "APPLICATIONINSIGHTS_CONNECTION_STRING";
    public static void Main(string[] args)
    {
        // support for .env file
        Env.Load();

        var builder = WebApplication.CreateBuilder(args);

        builder.Services
            .AddLogging();

        if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable(ApplicationInsightsConnectionString)))
        {
            builder.Services.AddOpenTelemetry().UseAzureMonitor();
        }

        var serviceName = "DHSC.FingertipsNext.Api";
        var serviceVersion = "1.0.0";

        builder.Services.AddOpenTelemetry().WithTracing(tcb =>
        {
            tcb.AddSource(serviceName)
                .SetResourceBuilder(ResourceBuilder.CreateDefault()
                    .AddService(serviceName: serviceName, serviceVersion: serviceVersion))
                .AddAspNetCoreInstrumentation()
                .AddHttpClientInstrumentation()
                .AddEntityFrameworkCoreInstrumentation();
            
            #if DEBUG
            tcb.AddConsoleExporter();
            #endif
        });

        builder.Services.AddSingleton(TracerProvider.Default.GetTracer(serviceName));

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
                    .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Axios)
                    .WithModels(true);
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
            module?.RegisterModule(services, configuration);
            module?.RegisterConfiguration(configuration);
        });
    }
}
