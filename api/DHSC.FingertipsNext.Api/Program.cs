using DHSC.FingertipsNext.Api.Middleware;
using DotNetEnv;

namespace DHSC.FingertipsNext.Api;

using Asp.Versioning;
using Azure.Monitor.OpenTelemetry.AspNetCore;
using DHSC.FingertipsNext.Api.Services;
using Microsoft.AspNetCore.OpenApi;
using Microsoft.Extensions.Options;
using Monolith;
using OpenTelemetry.Resources;
using OpenTelemetry.Trace;
using Scalar.AspNetCore;

public class Program
{
    private const string ApplicationInsightsConnectionString = "APPLICATIONINSIGHTS_CONNECTION_STRING";

    private Program()
    {
    }

    public static void Main(string[] args)
    {
#if DEBUG
        // support for .env file
        Env.Load(string.Empty, new LoadOptions(true, true, false));
#endif

        var builder = WebApplication.CreateBuilder(args);

        builder.Services
            .AddLogging();

        if (!string.IsNullOrEmpty(Environment.GetEnvironmentVariable(ApplicationInsightsConnectionString)))
            builder.Services.AddOpenTelemetry().UseAzureMonitor();

        const string serviceName = "DHSC.FingertipsNext.Api";
        const string serviceVersion = "1.0.0";

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


        // This is included to resolve a runtime crash on windows caused by https://github.com/dotnet/aspnetcore/issues/58805
        builder.Services.AddSingleton<IOptionsSnapshot<OpenApiOptions>>(sp =>
        {
            OpenApiOptions options = new OpenApiOptions();
            return new StaticOptions<OpenApiOptions>(options);
        });

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

        builder.Services.AddFingertipsUserAuth(builder.Configuration);

        var app = builder.Build();

        if (app.Environment.IsDevelopment())
        {
            app.MapOpenApi();

            app.MapScalarApiReference(options =>
            {
                options
                    .WithTitle("Fingertips Next API")
                    .WithDocumentDownloadType(DocumentDownloadType.Both)
                    .WithTheme(ScalarTheme.Purple)
                    .WithDefaultHttpClient(ScalarTarget.JavaScript, ScalarClient.Axios)
                    .WithModels(true);
            });
        }

        app.UseHttpsRedirection();

        app.UseFingerprintsAuth();

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
