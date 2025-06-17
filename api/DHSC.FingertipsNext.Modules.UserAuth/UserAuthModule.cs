using DHSC.FingertipsNext.Monolith;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DHSC.FingertipsNext.Modules.Area;

public class UserAuthModule : AbstractMonolithModule, IMonolithModule
{
    public override string ModuleName => "UserAuth";

    public override void RegisterModule(IServiceCollection services, IConfiguration configuration)
    {

    }
}
