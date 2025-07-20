using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public abstract class DataManagementIntegrationTests : IClassFixture<DataManagementWebApplicationFactory<Program>>, IDisposable
{
    protected const string AdminRoleGuid = "a6f09d79-e3de-48ae-b0ce-c48d5d8e5353";
    protected const string Indicator383GroupRoleId = "3b25520b-4cd5-4f45-8718-a0c8bcbcbf26";
    protected const string SqlScriptDirectory = "DataManagement";

    protected DataManagementIntegrationTests(DataManagementWebApplicationFactory<Program> factory)
    {
        Factory = factory;
        Factory.AdminRoleGuid = AdminRoleGuid;

        using var scope = Factory.Services.CreateScope();
        var dbContext = scope.ServiceProvider.GetRequiredService<DataManagementDbContext>();
        var connectionString = dbContext.Database.GetDbConnection().ConnectionString;
        Connection = new SqlConnection(connectionString);
        Connection.Open();

        ArgumentNullException.ThrowIfNull(factory);
        MockTime = new DateTime(2024, 6, 15, 10, 30, 45, 123, DateTimeKind.Utc);
        Factory.MockTime.SetUtcNow(MockTime);
    }

    protected SqlConnection Connection { get; }

    protected DateTime MockTime { get; }

    protected DataManagementWebApplicationFactory<Program> Factory { get; }


    public void Dispose()
    {
        Dispose(true);
        GC.SuppressFinalize(this);
    }

    protected virtual void Dispose(bool disposing)
    {
        if (!disposing) return;

        Connection.Close();
        Connection.Dispose();
    }

    protected static void InitialiseDb(SqlConnection sqlConnection, string filename)
    {
        ArgumentNullException.ThrowIfNull(sqlConnection);

        var setupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, filename);
        RunSqlScript(setupPath, sqlConnection);
    }

    protected static void RunSqlScript(string path, SqlConnection? connection)
    {
        var sql = File.ReadAllText(path);
        using var sqlCommand = new SqlCommand(sql, connection);
        sqlCommand.ExecuteNonQuery();
    }
}