using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
/// Interface to the business logic for accessing indicator data.
/// </summary>
public interface IIndicatorsService
{
    /// <summary>
    /// Get data for a public health indicator. Returns all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator.</param>
    /// <param name="areaCodes">A list of area codes. Up to 10 distinct area codes can be requested.</param>
    /// <param name="years">A list of years. Up to 10 distinct years can be requested.</param>
    /// <returns></returns>
    /// <remarks>
    /// If more than 10 years are supplied only data for the first 10 distinct years will be returned.
    /// If more than 10 area codes are supplied only data for the first 10 distinct area codes will be returned.
    /// </remarks>
    Task<IEnumerable<HealthDataForArea>> GetIndicatorData(int indicatorId, string[] areaCodes, int[] years);
    IEnumerable<HealthMeasureDto> GetIndicatorData_(int indicatorId, string[] areaCodes, int[] years);
}
