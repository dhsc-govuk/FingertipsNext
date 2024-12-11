namespace DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

public interface IIndicatorsController
{
    /// <summary>
    /// Get data for a public health indicator. This will return all data for all
    /// areas and all years for the indicators. Optionally filter the results by
    /// supplying one or more area codes and one or more years in the query string.
    /// </summary>
    /// <param name="indicatorId">The unique identifier of the indicator</param>
    /// <param name="areaCodes">A list of area codes, up to 10 area codes can be requested</param>
    /// <param name="years">A list of years, up to 10 years can be requested</param>
    /// <returns></returns>
    HealthDataForArea[] GetIndicatorData(int indicatorId, string[]? areaCodes = null, int[]? years = null);
}