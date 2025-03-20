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
    /// <param name="areaCodes">A list of area codes. Up to 10 distinct area codes can be requested.</param>
    /// <param name="areaType">The area type which the codes are taken from.</param>
    /// <param name="years">A list of years. Up to 10 distinct years can be requested.</param>
    /// <param name="inequalities">A list of desired inequalities.</param>
    /// <param name="comparisonMethod">BenchmarkType eg Rag, Quartile</param>
    /// <returns></returns>
    /// <remarks>
    ///     If more than 10 years are supplied only data for the first 10 distinct years will be returned.
    ///     If more than 10 area codes are supplied only data for the first 10 distinct area codes will be returned.
    /// </remarks>
    Task<IEnumerable<HealthDataForArea>> GetIndicatorDataAsync(int indicatorId, IEnumerable<string> areaCodes, string areaType, IEnumerable<int> years,
        IEnumerable<string> inequalities, BenchmarkComparisonMethod comparisonMethod);
}