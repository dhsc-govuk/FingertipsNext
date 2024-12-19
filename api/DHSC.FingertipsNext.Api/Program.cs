namespace DHSC.FingertipsNext.Api;

using Asp.Versioning;
using DHSC.FingertipsNext.Monolith;
using DHSC.FingertipsNext.Modules.Core.Repository;
using Scalar.AspNetCore;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

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

        RegisterDbContext(builder.Services, builder.Configuration);
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

    private static void RegisterDbContext(this IServiceCollection services, IConfiguration configuration)
    {
        // why don't we just store the connection string as the env variable instead of the bits?

        const string DbNameEnvironmentVariable = "DB_NAME";
        const string DbUserEnvironmentVariable = "DB_USER";
        const string DbPasswordEnvironmentVariable = "DB_PASSWORD";

        var dbName = configuration.GetValue<string>(DbNameEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbName))
        {
            throw new InvalidOperationException($"Environment variable {DbNameEnvironmentVariable} must be set");
        }

        var dbUser = configuration.GetValue<string>(DbUserEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbUser))
        {
            throw new InvalidOperationException($"Environment variable {DbUserEnvironmentVariable} must be set");
        }

        var dbPassword = configuration.GetValue<string>(DbPasswordEnvironmentVariable);
        if (string.IsNullOrWhiteSpace(dbPassword))
        {
            throw new InvalidOperationException($"Environment variable {DbPasswordEnvironmentVariable} must be set");
        }

        var connectionString = $"Server=localhost;Database={dbName};User Id={dbUser};Password={dbPassword};";

        services.AddDbContext<RepositoryDbContext>(options => options.UseSqlServer(connectionString));
    }
}
