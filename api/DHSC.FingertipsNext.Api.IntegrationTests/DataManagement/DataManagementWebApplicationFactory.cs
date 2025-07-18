using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Time.Testing;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public class DataManagementWebApplicationFactory<T> : WebApplicationFactory<T> where T : class
{
    public FakeTimeProvider MockTime { get; } = new();

    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder?.ConfigureServices(services =>
        {
            services.AddSingleton<TimeProvider>(MockTime);
        });
    }
}