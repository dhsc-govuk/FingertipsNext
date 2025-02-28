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
public class IndicatorService(IRepository _repository, IMapper _mapper) : IIndicatorsService
{
    public const string AreaCodeEngland = "E92000001";

    // polarity will come from somewhere else (DB indicator?) at a later date
    public string Polarity = BenchmarkPolarity.HighIsGood;

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
    /// <param name="comparisonMethod">Optional String to set comparison method e.g. RAG or Quartiles</param>
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
        // get the area codes and add our benchmark if it's not already there
        var (areaCodesForSearch, wasBenchMarkAreaAdded) = GetAreaCodesForSearch(areaCodes, comparisonMethod);

        // get the data from the database
        var healthMeasureData = await _repository.GetIndicatorDataAsync(
            indicatorId,
            areaCodesForSearch.ToArray(),
            years.Distinct().Take(10).ToArray(),
            inequalities.Distinct().ToArray());

        var allHealthDataForAreas = GroupAndSelect(healthMeasureData);

        // separate the data for results and data for performing benchmarks
        var (healthDataForAreas, benchmarkHealthData) =
            SeparateHealthAndBenchMarkData(allHealthDataForAreas, comparisonMethod, wasBenchMarkAreaAdded);

        return ApplyBenchMarkedAreaData(healthDataForAreas, benchmarkHealthData, comparisonMethod, Polarity);
    }

    private (string[] areaCodesForSearch, bool wasBenchMarkAreaAdded) GetAreaCodesForSearch(string[] areaCodes,
        string comparisonMethod)
    {
        var areaCodesForSearch = new List<string>(areaCodes.Distinct().Take(10).ToArray());

        if (comparisonMethod != Benchmark.Rag || areaCodes.Contains(AreaCodeEngland))
            return (areaCodesForSearch: areaCodesForSearch.ToArray(), wasBenchMarkAreaAdded: false);

        areaCodesForSearch.Add(AreaCodeEngland);
        return (areaCodesForSearch: areaCodesForSearch.ToArray(), wasBenchMarkAreaAdded: true);
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

    private static (IEnumerable<HealthDataForArea> healthDataForAreas, HealthDataForArea benchmarkHealthData)
        SeparateHealthAndBenchMarkData(IEnumerable<HealthDataForArea> allHealthDataForAreas, string comparisonMethod,
            bool wasBenchMarkAreaAdded)
    {
        // do nothing, no benchmark selected
        if (comparisonMethod != Benchmark.Rag) return (allHealthDataForAreas, null);

        // find the benchmark data
        var benchmarkHealthData = allHealthDataForAreas.FirstOrDefault(data => data.AreaCode == AreaCodeEngland);

        // if we added the benchmark area then remove it from the results
        return wasBenchMarkAreaAdded
            ? (allHealthDataForAreas.Where(data => data.AreaCode != AreaCodeEngland), benchmarkHealthData)
            : (allHealthDataForAreas, benchmarkHealthData);
    }

    private static IEnumerable<HealthDataForArea> ApplyBenchMarkedAreaData(
        IEnumerable<HealthDataForArea> healthDataForAreas,
        HealthDataForArea? benchmarkHealthData,
        string comparisonMethod,
        string polarity)
    {
        if (benchmarkHealthData == null) return healthDataForAreas;
        return healthDataForAreas.Select(areaData => Benchmark.MergeBenchmarkData(
            areaData,
            benchmarkHealthData,
            comparisonMethod,
            polarity));
    }
}