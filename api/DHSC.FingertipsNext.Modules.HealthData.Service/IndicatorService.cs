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
public class IndicatorService(IHealthDataRepository healthDataRepository, IHealthDataMapper healthDataMapper) : IIndicatorsService
{
    public const string AreaCodeEngland = "E92000001";

    /// <summary>
    ///     Obtain health point data for a single indicator.
    /// </summary>
    /// <param name="indicatorId"></param>
    /// <param name="areaCodes">
    ///     An array of area codes. If the array is empty all area codes are retrieved.
    /// </param>
    /// <param name="areaType">
    ///     The areaType which these codes should be compared against. This is important to specify to discriminate between
    ///     counties and districts which introduce amiguity to the areaType by duplicating areas.
    /// </param>
    /// <param name="ancestorCode">
    ///     The ancestorCode which these codes should be compared against. Dependent on what benchmarkRefType is set to.
    /// </param>    
    /// <param name="becnhmarkRefType">
    ///     The benchmark reference type to be used when benchmarking. England, SubNational or IndicatorGoal.
    /// </param>
    /// <param name="years">
    ///     An array of years. If the array is empty all years are retrieved.
    /// </param>
    /// <param name="inequalities">
    ///     An array of inequality dimensions to return. If the array is empty only data with no
    ///     inequality dimensions is retrieved.
    /// </param>
    /// <returns>
    ///     <c>IndicatorWithHealthDataForArea</c> matching the criteria
    /// </returns>
    public async Task<ServiceResponse<IndicatorWithHealthDataForAreas>> GetIndicatorDataAsync(
        int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        string ancestorCode,
        BenchmarkReferenceType benchmarkRefType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        bool latestOnly = false,
        DateOnly? fromDate = null,
        DateOnly? toDate = null
        )
    {
        var indicatorData = await healthDataRepository.GetIndicatorDimensionAsync(indicatorId, [.. areaCodes]);
        if (indicatorData == null)
            return new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.IndicatorDoesNotExist);

        var method = healthDataMapper.MapBenchmarkComparisonMethod(indicatorData.BenchmarkComparisonMethod);
        var polarity = healthDataMapper.MapIndicatorPolarity(indicatorData.Polarity);

        if (latestOnly)
            years = [indicatorData.LatestYear];

        var areaHealthData = ((await GetIndicatorAreaDataAsync(
            indicatorId,
            areaCodes,
            areaType,
            ancestorCode,
            benchmarkRefType,
            years,
            inequalities,
            method,
            polarity,
            fromDate,
            toDate
        )) ?? [])
        .ToList();

        await AddAreasWithNoData(areaHealthData, areaCodes);

        return new ServiceResponse<IndicatorWithHealthDataForAreas>()
        {
            Status = areaHealthData.Count != 0 ? ResponseStatus.Success : ResponseStatus.NoDataForIndicator,
            Content = new IndicatorWithHealthDataForAreas()
            {
                IndicatorId = indicatorData.IndicatorId,
                Name = indicatorData.Name,
                Polarity = polarity,
                BenchmarkMethod = method,
                AreaHealthData = areaHealthData
            }
        };
    }

    //if there is no health data for some areas we want to return empty data sets for those areas, so get the area data from the database
    private async Task AddAreasWithNoData(List<HealthDataForArea> areaHealthData, IEnumerable<string> areaCodes)
    {
        var areasWithNoData = areaCodes.Except(areaHealthData.Select(data => data.AreaCode)).ToArray();
        if (areasWithNoData.Length == 0)
            return;
        var areaWithNoData = await healthDataRepository.GetAreasAsync(areasWithNoData);

        areaHealthData.AddRange(areaWithNoData.Select(area => new HealthDataForArea
        {
            AreaCode = area.Code,
            AreaName = area.Name
        }));
    }

    private async Task<IEnumerable<HealthDataForArea>> GetIndicatorAreaDataAsync
    (
        int indicatorId,
        IEnumerable<string> areaCodes,
        string areaType,
        string ancestorCode,
        BenchmarkReferenceType benchmarkRefType,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity,
        DateOnly? fromDate = null,
        DateOnly? toDate = null
        )
    {
        IEnumerable<HealthMeasureModel> healthMeasureData;
        var areaCodesForSearch = areaCodes.ToList();

        // The benchmark reference can be either England or a passed in ancestorCode
        var benchmarkAreaCode = (benchmarkRefType == BenchmarkReferenceType.SubNational) ? ancestorCode : AreaCodeEngland;

        if (comparisonMethod == BenchmarkComparisonMethod.Quintiles)
        {
            // get the data from the database
            var denormalisedHealthMeasureData = await healthDataRepository.GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
                indicatorId,
                areaCodesForSearch.ToArray(),
                years.Distinct().ToArray(),
                areaType,
                benchmarkAreaCode,
                fromDate,
                toDate
                );


            return denormalisedHealthMeasureData
                .GroupBy(denormalisedHealthMeasure => new
                {
                    code = denormalisedHealthMeasure.AreaDimensionCode,
                    name = denormalisedHealthMeasure.AreaDimensionName
                })
                .Select(group => new HealthDataForArea
                {
                    AreaCode = group.Key.code,
                    AreaName = group.Key.name,
                    HealthData = healthDataMapper.Map(group.ToList())
                })
                .ToList();
        }

        var inequalitiesList = inequalities.ToList();

        // This controls whether Benchmark Comparisons are required based on the indicator comparison method.
        bool benchmarkingRequired = comparisonMethod is
             BenchmarkComparisonMethod.CIOverlappingReferenceValue95 or
             BenchmarkComparisonMethod.CIOverlappingReferenceValue998;

        // Benchmarking can be against a reference area BUT Not if you are using inequalities
        bool benchmarkAgainstRefArea = benchmarkingRequired && inequalitiesList.Count == 0;

        // We may need to add the benchmark area to the list of areas to be fetched (we later remove it from returned dat)
        bool addBenchmarkAreaToList = benchmarkAgainstRefArea && !areaCodesForSearch.Contains(benchmarkAreaCode);


        //if benchmark data has been requested and the benchmark area wasn't already in the requested area collection add it now
        if (addBenchmarkAreaToList)
            areaCodesForSearch.Add(benchmarkAreaCode);

        // get the data from the database
        healthMeasureData = await healthDataRepository.GetIndicatorDataAsync(
            indicatorId,
            areaCodesForSearch.ToArray(),
            years.Distinct().ToArray(),
            inequalitiesList.Distinct().ToArray(),
            fromDate,
            toDate);

        var healthDataForAreas = healthMeasureData
            .GroupBy(healthMeasure => new
            {
                code = healthMeasure.AreaDimension.Code,
                name = healthMeasure.AreaDimension.Name,
                periodType = healthMeasure.PeriodDimension.Period
            })
            .Select(areaGroup => new HealthDataForArea
            {
                AreaCode = areaGroup.Key.code,
                AreaName = areaGroup.Key.name,
                HealthData = healthDataMapper.Map(areaGroup.ToList())
                    .Where(hdp => hdp.Sex.IsAggregate || inequalitiesList.Contains("sex"))
                    .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                    .ToList(),
                IndicatorSegments = areaGroup.GroupBy(healthMeasure => new
                {
                    sexName = healthMeasure.SexDimension.Name,
                    isAggregate = healthMeasure.SexDimension.IsAggregate
                })
                .Select(segmentGroup => new IndicatorSegment
                {
                    Sex = new Sex { Value = segmentGroup.Key.sexName, IsAggregate = segmentGroup.Key.isAggregate },
                    IsAggregate = segmentGroup.Key.isAggregate,
                    HealthData = healthDataMapper.Map(segmentGroup.ToList())
                      .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                      .ToList()
                }).ToList()
            })
            .ToList();

        if (!benchmarkingRequired)
            return healthDataForAreas;

        // separate the data for results and data for performing benchmarks
        var benchmarkHealthData = benchmarkAgainstRefArea ? healthDataForAreas.FirstOrDefault(data => data.AreaCode == benchmarkAreaCode) : null;
        if (benchmarkAgainstRefArea && benchmarkHealthData == null)
            return healthDataForAreas;

        //if the benchmark area was not in the original request then remove the benchmark data
        if (!addBenchmarkAreaToList)
            healthDataForAreas.RemoveAll(data => data.AreaCode == benchmarkAreaCode);

        // enrich the data with benchmark comparison
        return BenchmarkComparisonEngine.ProcessBenchmarkComparisons
        (
            healthDataForAreas,
            benchmarkHealthData,
            polarity
        );
    }

    /// <summary>
    ///     Obtain health point data for a single indicator.
    /// </summary>
    /// <param name="indicatorIds">An array of upto 50 indicator Ids.</param>
    /// <param name="areaCode">
    ///     An area code for which we want to include data for the indicator.
    /// </param>
    /// <param name="areaType">
    ///     The areaType which these codes should be compared against. This is important to specify to discriminate between
    ///     counties and districts which introduce amiguity to the areaType by duplicating areas.
    /// </param>
    /// <param name="ancestorCode">
    ///     An additional areaType for which we want to return the value for for this indicator.
    /// </param>
    /// <returns>
    ///     <c>QuartileData for the latest years for which the indicators have data.
    /// </returns>
    public async Task<IEnumerable<IndicatorQuartileData>?> GetQuartileDataAsync(
        IEnumerable<int> indicatorIds,
        string areaCode,
        string areaType,
        string ancestorCode,
        string benchmarkAreaCode
        )
    {
        var quartileData = await healthDataRepository.GetQuartileDataAsync(indicatorIds, areaCode, areaType, ancestorCode, benchmarkAreaCode);

        return quartileData == null ? null : healthDataMapper.Map(quartileData.ToList());
    }
}