using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Monolith;

public interface IMonolithModule
{
    public void RegisterModule(IServiceCollection services, IConfiguration configuration);
    public void RegisterConfiguration(IConfigurationBuilder configurationBuilder);
}