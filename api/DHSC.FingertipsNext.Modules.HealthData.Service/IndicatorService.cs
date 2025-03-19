using AutoMapper;
using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     The business logic for accessing indicator data.
/// </summary>
/// <remarks>
///     Does not include anything specific to the hosting technology being used.
/// </remarks>
public class IndicatorService(IHealthDataRepository healthDataRepository, IMapper _mapper) : IIndicatorsService
{
    public const string AreaCodeEngland = "E92000001";

    // polarity will come from somewhere else (DB indicator?) at a later date
    public IndicatorPolarity Polarity = IndicatorPolarity.HighIsGood;

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
    /// <param name="comparisonMethod">BenchmarkType to set comparison method e.g. None, RAG or Quartiles</param>
    /// <returns>
    ///     An enumerable of <c>HealthDataForArea</c> matching the criteria,
    ///     otherwise an empty enumerable.
    /// </returns>
    public async Task<IEnumerable<HealthDataForArea>> GetIndicatorDataAsync
        (
        int indicatorId,
        IEnumerable<string> areaCodes,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        BenchmarkComparisonMethod comparisonMethod
        )
    {
        //if RAG is the benchmark method use England as the comparison area and add England to the areas we want data for
        var areaCodesForSearch = areaCodes.ToList();
        var benchmarkAreaCode = AreaCodeEngland; //for PoC all benchmarking is against England, post PoC this will be passed in as a variable
        var wasBenchmarkAreaCodeRequested = areaCodesForSearch.Contains(benchmarkAreaCode);
        var hasBenchmarkDataBeenRequested = comparisonMethod == BenchmarkComparisonMethod.Rag;
        
        //if benchmark data has been requested and the benchmark area wasn't already in the requested area collection add it now
        if (hasBenchmarkDataBeenRequested && !wasBenchmarkAreaCodeRequested)
            areaCodesForSearch.Add(benchmarkAreaCode);

        // get the data from the database
        var healthMeasureData = await healthDataRepository.GetIndicatorDataAsync(
            indicatorId,
            areaCodesForSearch.ToArray(),
            years.Distinct().ToArray(),
            inequalities.Distinct().ToArray());

        var healthDataForAreas = healthMeasureData
            .GroupBy(healthMeasure => new 
            {
                code = healthMeasure.AreaDimension.Code,
                name = healthMeasure.AreaDimension.Name 
            })
            .Select(group => new HealthDataForArea
            {
                AreaCode = group.Key.code,
                AreaName = group.Key.name,
                HealthData = _mapper.Map<IEnumerable<HealthDataPoint>>(group.ToList())
            })
            .ToList();

        if (!hasBenchmarkDataBeenRequested)
            return healthDataForAreas;

        // separate the data for results and data for performing benchmarks
        var benchmarkHealthData=healthDataForAreas.FirstOrDefault(data => data.AreaCode == benchmarkAreaCode);
        if(benchmarkHealthData == null && !inequalities.Any())
            return healthDataForAreas;

        //if the benchmark area was not in the original request then remove the benchmark data
        if (!wasBenchmarkAreaCodeRequested)
            healthDataForAreas.RemoveAll(data => data.AreaCode == benchmarkAreaCode);
        
        // enrich the data with benchmark comparison
        return BenchmarkComparisonEngine.ProcessBenchmarkComparisons
        (
            healthDataForAreas,
            benchmarkHealthData,
            comparisonMethod,
            Polarity
        );
    }
}