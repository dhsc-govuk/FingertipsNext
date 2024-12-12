using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

namespace DHSC.FingertipsNext.Modules.Indicators.Services;

/// <summary>
///
/// </summary>
public class IndicatorService(IIndicatorsDataProvider provider) : IIndicatorsService
{
    /// <summary>
    /// Obtain health point data for a single indicator.
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes">An array of upto 10 area codes. If more than 10 elements exist,
    /// only the first 10 are used. If the array is empty all area codes are retrieved.</param>
    /// <param name="years">An array of upto 10 years. If more than 10 elements exist,
    /// only the first 10 are used. If the array is empty all years are retrieved.</param>
    /// <returns>An enumerable of <c>HealthDataForArea</c> matching the criteria,
    /// otherwise an empty enumerable.</returns>
    public Task<IEnumerable<HealthDataForArea>> GetIndicatorData(
        int indicatorId,
        string[] areaCodes,
        int[] years
    )
    {
        return provider.GetIndicatorData(
            indicatorId,
            areaCodes.Take(10).Distinct().ToArray(),
            years.Take(10).Distinct().ToArray()
        );
    }
}
