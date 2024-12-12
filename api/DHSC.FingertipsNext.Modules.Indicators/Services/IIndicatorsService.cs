using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

namespace DHSC.FingertipsNext.Modules.Indicators.Services;

/// <summary>
/// 
/// </summary>
public interface IIndicatorsService
{
    /// <summary>
    /// 
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes"></param>
    /// <param name="years"></param>
    /// <returns></returns>
    Task<IEnumerable<HealthDataForArea>> GetIndicatorData(int indicatorId, string[] areaCodes, int[] years);
}
