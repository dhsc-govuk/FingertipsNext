using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
/// The business logic for accessing indicator data.
/// </summary>
/// <remarks>
/// Does not include anything specific to the hosting technology being used.
/// </remarks>
public class IndicatorService(IRepository _repository, IMapper _mapper) : IIndicatorsService
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
    public IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string[] areaCodes, int[] years)
    {
        return _mapper.Map<IEnumerable<HealthMeasure>>(
            _repository.GetIndicatorData(
            indicatorId,
            areaCodes.Distinct().Take(10).ToArray(),
            years.Distinct().Take(10).ToArray())
            );
    }
}
