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
    public async Task<IEnumerable<HealthDataForArea>> GetIndicatorDataAsync(int indicatorId,
        IEnumerable<string> areaCodes,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        BenchmarkComparisonMethod comparisonMethod)
    {
        var benchmarkAreaCode = comparisonMethod == BenchmarkComparisonMethod.Rag ? AreaCodeEngland : "";

        // get the area codes and add our benchmark if it's not already there
        var (areaCodesForSearch, wasBenchMarkAreaAdded) =
            GetAreaCodesForSearch(areaCodes, benchmarkAreaCode);

        // get the data from the database
        var healthMeasureData = await healthDataRepository.GetIndicatorDataAsync(
            indicatorId,
            areaCodesForSearch.ToArray(),
            years.Distinct().Take(10).ToArray(),
            inequalities.Distinct().ToArray());

        var allHealthDataForAreas = GroupByArea(healthMeasureData);

        // separate the data for results and data for performing benchmarks
        var benchmarkHealthData = GetBenchMarkData(allHealthDataForAreas, benchmarkAreaCode);
        var healthDataForAreas = GetHealthDataForAreas(allHealthDataForAreas, benchmarkAreaCode, wasBenchMarkAreaAdded);

        // enrich the data with benchmark comparison
        return BenchmarkComparisonIterator.ProcessBenchmarkComparisons(
            healthDataForAreas,
            benchmarkHealthData,
            comparisonMethod,
            Polarity
        );
    }

    // Determine the area codes to use in the database query
    // areaCodesForSearch: IEnumerable string - the codes for the database search
    // wasBenchMarkAreaAdded: bool - if the benchmark area code was added or was already part of the requested area codes
    // examples: given the benchmark area is England 
    //   if then request param areaCodes did not already include it then add it wasBenchMarkAreaAdded = true
    //   if then request param areaCodes already includes the benchmark area code then we do not need to add it and wasBenchMarkAreaAdded = false
    // By doing this there is only one call to the database and benchmark and area data are separated afterwards
    private static (IEnumerable<string> areaCodesForSearch, bool wasBenchMarkAreaAdded) GetAreaCodesForSearch(
        IEnumerable<string> areaCodes,
        string benchmarkAreaCode)
    {
        var areaCodesForSearch = new List<string>(areaCodes.Distinct().Take(10));

        if (benchmarkAreaCode == "" || areaCodes.Contains(benchmarkAreaCode))
            return (areaCodesForSearch, wasBenchMarkAreaAdded: false);

        areaCodesForSearch.Add(benchmarkAreaCode);
        return (areaCodesForSearch, wasBenchMarkAreaAdded: true);
    }

    // group the data into areas
    private IEnumerable<HealthDataForArea> GroupByArea(IEnumerable<HealthMeasureModel> healthMeasureData)
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

    // find the benchmark data in the DB results
    private static HealthDataForArea? GetBenchMarkData(IEnumerable<HealthDataForArea> allHealthDataForAreas,
        string benchmarkAreaCode)
    {
        return benchmarkAreaCode == ""
            ? null
            : allHealthDataForAreas.FirstOrDefault(data => data.AreaCode == benchmarkAreaCode);
    }

    // get the health area data without the benchmark data - unless the benchmark area was specifically requested
    private static IEnumerable<HealthDataForArea> GetHealthDataForAreas(
        IEnumerable<HealthDataForArea> allHealthDataForAreas, string benchmarkAreaCode, bool wasBenchMarkAreaAdded)
    {
        return wasBenchMarkAreaAdded
            ? RemoveBenchmarkData(allHealthDataForAreas, benchmarkAreaCode)
            : allHealthDataForAreas;
    }

    // remove the benchmark data
    private static IEnumerable<HealthDataForArea> RemoveBenchmarkData(
        IEnumerable<HealthDataForArea> allHealthDataForAreas, string benchmarkAreaCode)
    {
        return benchmarkAreaCode == ""
            ? allHealthDataForAreas
            : allHealthDataForAreas.Where(data => data.AreaCode != benchmarkAreaCode);
    }
}