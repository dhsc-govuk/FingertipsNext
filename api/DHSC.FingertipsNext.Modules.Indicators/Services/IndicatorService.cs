using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

namespace DHSC.FingertipsNext.Modules.Indicators.Services;

/// <summary>
///
/// </summary>
public class IndicatorService(IIndicatorsDataProvider provider) : IIndicatorsService
{
    public Task<IEnumerable<HealthDataForArea>> GetIndicatorData(
        int indicatorId,
        string[] areaCodes,
        int[] years
    )
    {
        areaCodes = areaCodes.Distinct().Take(10).ToArray();
        years = years.Distinct().Take(10).ToArray();
        
        return provider.GetIndicatorData(indicatorId, areaCodes, years);
    }
}
