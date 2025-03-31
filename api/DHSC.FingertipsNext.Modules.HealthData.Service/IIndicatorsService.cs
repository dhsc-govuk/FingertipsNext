using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     Interface to the business logic for accessing indicator data.
/// </summary>
public interface IIndicatorsService
{
    /// <summary>
    ///     Get data for a public health indicator. Returns all data for all
    ///     areas and all years for the indicators. Optionally filter the results by
    ///     supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes.</param>
    /// <param name="areaType">The area type which the codes are taken from.</param>
    /// <param name="years">A list of years.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <returns>
    ///     <c>IndicatorWithHealthDataForArea</c> matching the criteria
    /// </returns>
    Task<IndicatorWithHealthDataForAreas?> GetIndicatorDataAsync(int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities);
}