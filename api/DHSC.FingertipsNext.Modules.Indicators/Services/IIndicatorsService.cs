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
    //
    //
    // TODO: what is the expected return if the requested indicator is not recognised/has-no-data etc. I have assumed empty array
    // TODO: exected format of area codes
    //
    // TODO: are there restrictions on indicatorIds I can filter out or are unsupported, such as negative numbers
    // TODO: are there restrictions on areaCodes I can filter out or are unsupported
    // TODO: are there restrictions on years I can filter out or are unsupported, such as pre-1950
    IEnumerable<HealthDataForArea> GetIndicatorData(int indicatorId, string[] areaCodes, int[] years);
}
