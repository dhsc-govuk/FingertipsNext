using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

namespace DHSC.FingertipsNext.Modules.Indicators.Services;

public interface IIndicatorsDataProvider
{
    Task<IEnumerable<HealthDataForArea>> GetIndicatorData(
        int indicatorId,
        string[] areaCodes,
        int[] years
    );
}
