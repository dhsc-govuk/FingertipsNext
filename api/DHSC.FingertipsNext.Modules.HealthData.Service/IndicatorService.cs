using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     The business logic for accessing indicator data.
/// </summary>
/// <remarks>
///     Does not include anything specific to the hosting technology being used.
/// </remarks>
public class IndicatorService(IRepository _repository, IMapper _mapper) : IIndicatorsService
{
    private const string AreaCodeEngland = "E92000001";
    
    /// <summary>
    ///     Obtain health point data for a single indicator.
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes">
    ///     An array of upto 10 area codes. If more than 10 elements exist,
    ///     only the first 10 are used. If the array is empty all area codes are retrieved.
    /// </param>
    /// <param name="years">
    ///     An array of upto 10 years. If more than 10 elements exist,
    ///     only the first 10 are used. If the array is empty all years are retrieved.
    /// </param>
    /// <param name="inequalities">
    ///     An array of inequality dimensions to return. If the array is empty only data with no
    ///     inequality dimensions is retrieved.
    /// </param>
    /// <param name="comparisonMethod">Optional String to set comparison method eg RAG or Quartiles</param>
    /// <returns>
    ///     An enumerable of <c>HealthMeasure</c> matching the criteria,
    ///     otherwise an empty enumerable.
    /// </returns>
    public async Task<IEnumerable<HealthDataForArea>> GetIndicatorDataAsync(int indicatorId,
        string[] areaCodes,
        int[] years,
        string[] inequalities,
        string comparisonMethod)
    {
        var healthMeasureData = await _repository.GetIndicatorDataAsync(
            indicatorId,
            areaCodes.Distinct().Take(10).ToArray(),
            years.Distinct().Take(10).ToArray(),
            inequalities.Distinct().ToArray());

        var healthDataForArea = GroupAndSelect(healthMeasureData);

        if (comparisonMethod != Benchmark.Rag) return healthDataForArea;

        var healthBenchmarkData = await _repository.GetIndicatorDataAsync(
            indicatorId,
            [AreaCodeEngland],
            years.Distinct().Take(10).ToArray(),
            inequalities.Distinct().ToArray());
        var healthDataForBenchmark = GroupAndSelect(healthBenchmarkData);

        return Benchmark.MergeBenchmarkData(healthDataForArea, healthDataForBenchmark, comparisonMethod);
    }

    private IEnumerable<HealthDataForArea> GroupAndSelect(IEnumerable<HealthMeasureModel> healthMeasureData)
    {
        return healthMeasureData
            .GroupBy(data => new { code = data.AreaDimension.Code, name = data.AreaDimension.Name })
            .Select(group => new HealthDataForArea
            {
                AreaCode = group.Key.code,
                AreaName = group.Key.name,
                HealthData = _mapper.Map<IEnumerable<HealthDataPoint>>(group.ToList())
            });
    }

   
 
}