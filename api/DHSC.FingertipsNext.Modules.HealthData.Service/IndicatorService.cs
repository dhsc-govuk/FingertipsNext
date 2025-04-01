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
public class IndicatorService(IHealthDataRepository healthDataRepository, IMapper _mapper) : IIndicatorsService
{
    public const string AreaCodeEngland = "E92000001";
    
    /// <summary>
    ///     Obtain health point data for a single indicator.
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes">
    ///     An array of upto 10 area codes. If more than 10 elements exist,
    ///     only the first 10 are used. If the array is empty all area codes are retrieved.
    /// </param>
    /// <param name="areaType">
    ///     The areaType which these codes should be compared against. This is important to specify to discriminate between
    ///     counties and districts which introduce amiguity to the areaType by duplicating areas.
    /// </param>
    /// <param name="years">
    ///     An array of upto 10 years. If more than 10 elements exist,
    ///     only the first 10 are used. If the array is empty all years are retrieved.
    /// </param>
    /// <param name="inequalities">
    ///     An array of inequality dimensions to return. If the array is empty only data with no
    ///     inequality dimensions is retrieved.
    /// </param>
    /// <returns>
    ///     <c>IndicatorWithHealthDataForArea</c> matching the criteria
    /// </returns>
    public async Task<IndicatorWithHealthDataForAreas?> GetIndicatorDataAsync(
        int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities)
    {
        var indicatorData = await healthDataRepository.GetIndicatorDimensionAsync(indicatorId);
        if (indicatorData == null) return null;
        var method = _mapper.Map<BenchmarkComparisonMethod>(indicatorData.BenchmarkComparisonMethod);
        var polarity = _mapper.Map<IndicatorPolarity>(indicatorData.Polarity); 
        
        return new IndicatorWithHealthDataForAreas()
        {
            IndicatorId = indicatorData.IndicatorId,
            Name = indicatorData.Name,
            Polarity = polarity,
            BenchmarkMethod = method,
            AreaHealthData = await GetIndicatorAreaDataAsync(
                indicatorId, 
                areaCodes,
                areaType,
                years,
                inequalities, 
                method,
                polarity
                )
        };
    } 
    

    private async Task<IEnumerable<HealthDataForArea>> GetIndicatorAreaDataAsync
    (
        int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity
        )
    {
        IEnumerable<HealthMeasureModel> healthMeasureData;
        var areaCodesForSearch = areaCodes.ToList();

        if (comparisonMethod == BenchmarkComparisonMethod.Quintiles)
        {
            // get the data from the database
            healthMeasureData = await healthDataRepository.GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
                indicatorId,
                areaCodesForSearch.ToArray(),
                years.Distinct().ToArray(),
                areaType
                );

            return healthMeasureData
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
        }

        //if RAG is the benchmark method use England as the comparison area and add England to the areas we want data for
        var benchmarkAreaCode = AreaCodeEngland; //for PoC all benchmarking is against England, post PoC this will be passed in as a variable
        var wasBenchmarkAreaCodeRequested = areaCodesForSearch.Contains(benchmarkAreaCode);

        var hasBenchmarkDataBeenRequested = comparisonMethod is
             BenchmarkComparisonMethod.CIOverlappingReferenceValue95 or
             BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8;

        //if benchmark data has been requested and the benchmark area wasn't already in the requested area collection add it now
        if (hasBenchmarkDataBeenRequested && !wasBenchmarkAreaCodeRequested)
            areaCodesForSearch.Add(benchmarkAreaCode);

        // get the data from the database
        healthMeasureData = await healthDataRepository.GetIndicatorDataAsync(
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
            polarity
        );
    }
}