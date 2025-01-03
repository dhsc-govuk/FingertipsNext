using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;

namespace DHSC.FingertipsNext.Modules.Core.Controllers.V1;

[ApiController]
[Route("[controller]")]
public class WeatherForecastController : ControllerBase
{
    private static readonly string[] Summaries = new[]
    {
        "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
    };

    private readonly string _connectionString;

    private readonly ILogger<WeatherForecastController> _logger;

    public WeatherForecastController(ILogger<WeatherForecastController> logger)
    {
        _logger = logger;

        var dbServer = Environment.GetEnvironmentVariable("DB_SERVER");
        var dbName = Environment.GetEnvironmentVariable("DB_NAME");
        var dbUser = Environment.GetEnvironmentVariable("DB_USER");
        var dbPassword = Environment.GetEnvironmentVariable("DB_PASSWORD");

        if (dbServer == null || dbName == null || dbUser == null || dbPassword == null)
        {
            throw new ArgumentException("Invalid environment variables provided. Check DB_SERVER, DB_NAME, DB_USER & DB_PASSWORD have been set appropriately");
        }

        var trustServerCertificate = false;
        trustServerCertificate = Boolean.TryParse(Environment.GetEnvironmentVariable("TRUST_CERT"),
            out trustServerCertificate);

        if (trustServerCertificate)
        {
            _logger.LogWarning("Server certificate validation has been disabled (by setting the TRUST_CERT environment variable). This should only be done for local development!");
        }

        var builder = new SqlConnectionStringBuilder
        {
            DataSource = dbServer,
            UserID = dbUser,
            Password = dbPassword,
            InitialCatalog = dbName,
            TrustServerCertificate = trustServerCertificate
        };

        _connectionString = builder.ConnectionString;
    }

    [HttpGet(Name = "GetWeatherForecast")]
    public async Task<IEnumerable<WeatherForecast>> Get()
    {

        try
        {
            await using var connection = new SqlConnection(_connectionString);
            await connection.OpenAsync();

            const string sql = "SELECT TOP (1000) [Id], [Date], [TemperatureC], [Summary] FROM [WeatherForecast]";
            await using var command = new SqlCommand(sql, connection);
            await using var reader = await command.ExecuteReaderAsync();

            var forecasts = new List<WeatherForecast>();
            while (await reader.ReadAsync())
            {
                var forecast = new WeatherForecast
                {
                    Date = DateOnly.FromDateTime(reader.GetDateTime(1)),
                    TemperatureC = reader.GetInt32(2),
                    Summary = reader.GetString(3),
                };
                forecasts.Add(forecast);
            }

            return forecasts;
        }
        catch (Exception e)
        {
            _logger.LogError(e, "Failed to retrieve weather forecasts from database. {connectionString}",
                [_connectionString]);
            throw;
        }
    }
}