using DHSC.FingertipsNext.Modules.Area.Controllers;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Modules.Area;

/// <summary>
/// 
/// </summary>
/// <param name="configuration"></param>
public class AreaModuleConfig(IConfiguration configuration) : IAreaModuleConfig
{
    public string DataSource => GetRequired("DB_SERVER");
    public string UserId => GetRequired("DB_USER");
    public string Password => GetRequired("DB_PASSWORD");
    public string InitialCatalog => GetRequired("DB_NAME");
    public bool TrustServerCertificate => configuration.GetValue("TRUST_CERT", false);

    string GetRequired(string key) => configuration.GetValue<string>(key)
            ?? throw new InvalidOperationException($"Module:Area: Invalid config - {key}");
}
