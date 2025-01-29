namespace DHSC.FingertipsNext.Modules.Area.Controllers;

/// <summary>
/// 
/// </summary>
public interface IAreaModuleConfig
{
    /// <summary>
    /// 
    /// </summary>
    /// <exception cref="InvalidOperationException">When the datasource is not part of the configuration.</exception>
    string DataSource { get; }
    
    /// <summary>
    /// 
    /// </summary>
    /// <exception cref="InvalidOperationException">When the user id is not part of the configuration.</exception>
    string UserId { get; }
    
    /// <summary>
    /// 
    /// </summary>
    /// <exception cref="InvalidOperationException">When the password is not part of the configuration.</exception>
    string Password { get; }
    
    /// <summary>
    /// 
    /// </summary>
    /// <exception cref="InvalidOperationException">When the initial catalog is not part of the configuration.</exception>
    string InitialCatalog { get; }
    
    /// <summary>
    /// 
    /// </summary>
    /// <returns>True when datasource server certificate should be trusted, otherwise False.</returns>
    bool TrustServerCertificate { get; }
}