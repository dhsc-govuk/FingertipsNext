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
    Task<ServiceResponse<IndicatorWithHealthDataForAreas>> GetIndicatorDataAsync(int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities);

    /// <summary>
    ///     Get quartile data for set of public health indicators. Returns data for all
    ///     indicators for the latest year for that indicator. It includes the average value for the
    ///     selected area, ancestor area and Englad where available.
    /// </summary>
    /// <param name="indicatorIds">The unique identifiers for the requested indicators.</param>
    /// <param name="areaCode">The area code for comparison.</param>
    /// <param name="areaType">The area type which the codes are taken from.</param>
    /// <param name="ancestorCode">The ancestor for comparison.</param>
    /// <returns>
    ///     <c>IndicatorWithHealthDataForArea</c> matching the criteria
    /// </returns>
    Task<IEnumerable<IndicatorQuartileData>> GetQuartileDataAsync(
        IEnumerable<int> indicatorIds,
        string areaCode,
        string areaType,
        string ancestorCode);
}