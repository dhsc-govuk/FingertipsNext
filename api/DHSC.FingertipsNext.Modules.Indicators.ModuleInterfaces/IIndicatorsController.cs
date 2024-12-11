namespace DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;

public interface IIndicatorsController
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
    /// If more than 10 years are supplied only data for the first 10 distinct years will be be returned.
    /// If more than 10 area codes are supplied only data for the first 10 distinct area codes will be returned.
    /// </remarks>
    //
    // TODO: expected format of area codes (spaces etc)
    // TODO: are area codes case sensitive
    // TODO: any other parameter restrictions
    // TODO: doc comment above tweaked/clarified compared to swagger
    HealthDataForArea[] GetIndicatorData(
        int indicatorId,
        string[]? areaCodes = null,
        int[]? years = null
    );
}
