using DHSC.FingertipsNext.Modules.HealthData.Repository;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;

namespace DHSC.FingertipsNext.Modules.HealthData.Service;

/// <summary>
///     The business logic for accessing indicator data.
/// </summary>
/// <remarks>
///     Does not include anything specific to the hosting technology being used.
/// </remarks>
public class IndicatorService(IHealthDataRepository healthDataRepository, IHealthDataMapper healthDataMapper, ILogger<IIndicatorsService> logger) : IIndicatorsService
{
    public const string AreaCodeEngland = "E92000001";

    private static readonly Action<ILogger, string, string, Exception?> DbErrorLog =
        LoggerMessage.Define<string, string>(
            LogLevel.Error,
            new EventId(1, "DbError"),
        "Delete operation on batchId {BatchId} failed in DB with exception: {ErrorMessage}");

    private static readonly Action<ILogger, string, Exception?> DeleteSuccessLog =
        LoggerMessage.Define<string>(
            LogLevel.Information,
            new EventId(1, "DeleteSuccess"),
            "Deletion of batch with id: {BatchId} successful");

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
        DateOnly? toDate = null,
        bool includeUnpublished = false
        )
    {
        var indicator = await healthDataRepository.GetIndicatorDimensionAsync(indicatorId, [.. areaCodes], includeUnpublished);
        if (indicator == null)
            return new ServiceResponse<IndicatorWithHealthDataForAreas>(ResponseStatus.IndicatorDoesNotExist);

        var method = healthDataMapper.MapBenchmarkComparisonMethod(indicator.BenchmarkComparisonMethod);
        var polarity = healthDataMapper.MapIndicatorPolarity(indicator.Polarity);

        if (latestOnly)
            years = [indicator.LatestYear];

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
            toDate,
            includeUnpublished
        )) ?? [])
        .ToList();

        await AddAreasWithNoData(areaHealthData, areaCodes);

        return new ServiceResponse<IndicatorWithHealthDataForAreas>()
        {
            Status = areaHealthData.Count != 0 ? ResponseStatus.Success : ResponseStatus.NoDataForIndicator,
            Content = new IndicatorWithHealthDataForAreas
            {
                IndicatorId = indicator.IndicatorId,
                Name = indicator.Name,
                CollectionFrequency = healthDataMapper.MapCollectionFrequency(indicator.CollectionFrequency),
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
        DateOnly? toDate = null,
        bool includeUnpublished = false
        )
    {
        var areaCodesForSearch = areaCodes.ToList();

        // The benchmark reference can be either England or a passed in ancestorCode
        var benchmarkAreaCode = (benchmarkRefType == BenchmarkReferenceType.SubNational) ? ancestorCode : AreaCodeEngland;

        if (comparisonMethod == BenchmarkComparisonMethod.Quintiles)
        {
            // get the data from the database
            return await GetIndicatorAreaDataWithQuintilesBenchmarkingAsync(
                indicatorId,
                areaCodesForSearch,
                areaType,
                benchmarkAreaCode,
                years,
                fromDate,
                toDate,
                includeUnpublished
            );
        }
        else
        {
            // get the data from the database
            return await GetIndicatorAreaDataWithNonQuintilesBenchmarkingAsync(
                indicatorId,
                areaCodesForSearch,
                benchmarkAreaCode,
                years,
                inequalities,
                comparisonMethod,
                polarity,
                fromDate,
                toDate,
                includeUnpublished
            );

        }
    }


    private async Task<IEnumerable<HealthDataForArea>> GetIndicatorAreaDataWithQuintilesBenchmarkingAsync
    (
        int indicatorId,
        List<string> areaCodesForSearch,
        string areaType,
        string benchmarkAreaCode,
        IEnumerable<int> years,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false
        )
    {

        // get the data from the database
        var denormalisedHealthMeasureData = await healthDataRepository.GetIndicatorDataWithQuintileBenchmarkComparisonAsync
        (
            indicatorId,
            areaCodesForSearch.ToArray(),
            years.Distinct().ToArray(),
            areaType,
            benchmarkAreaCode,
            fromDate,
            toDate,
            includeUnpublished
        );

        return denormalisedHealthMeasureData
            .GroupBy(denormalisedHealthMeasure => new
            {
                code = denormalisedHealthMeasure.AreaDimensionCode,
                name = denormalisedHealthMeasure.AreaDimensionName,
                periodType = denormalisedHealthMeasure.PeriodType,
            })
            .Select(areaGroup => new HealthDataForArea
            {
                AreaCode = areaGroup.Key.code,
                AreaName = areaGroup.Key.name,
                HealthData = healthDataMapper.Map(areaGroup.ToList())
                .Where(dataPoint => dataPoint.IsAggregate && dataPoint.AgeBand.IsAggregate)
                .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                .ToList(),
                IndicatorSegments = areaGroup.GroupBy(healthMeasure => new
                {
                    ageName = healthMeasure.AgeDimensionName,
                    ageIsAggregate = healthMeasure.AgeDimensionIsAggregate,
                    sexName = healthMeasure.SexDimensionName,
                    sexIsAggregate = healthMeasure.SexDimensionIsAggregate
                })
            .Select(segmentGroup => new IndicatorSegment
            {
                Age = new Age { Value = segmentGroup.Key.ageName, IsAggregate = segmentGroup.Key.ageIsAggregate },
                Sex = new Sex { Value = segmentGroup.Key.sexName, IsAggregate = segmentGroup.Key.sexIsAggregate },
                IsAggregate = segmentGroup.Key.ageIsAggregate && segmentGroup.Key.sexIsAggregate,
                HealthData = healthDataMapper.Map(segmentGroup.ToList())
                  .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                  .ToList()
            })
            .OrderBy(segment => segment.Sex.Value)
            .ThenBy(segment => segment.Age.Value)
            .ToList()
            })
            .ToList();
    }
    private async Task<IEnumerable<HealthDataForArea>> GetIndicatorAreaDataWithNonQuintilesBenchmarkingAsync
    (
        int indicatorId,
        List<string> areaCodesForSearch,
        string benchmarkAreaCode,
        IEnumerable<int> years,
        IEnumerable<string> inequalities,
        BenchmarkComparisonMethod comparisonMethod,
        IndicatorPolarity polarity,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false
        )
    {
        IEnumerable<HealthMeasureModel> healthMeasureData;

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
            toDate,
            includeUnpublished);

        // Structure the returned data into Areas and IndicatorSegments
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
                    .Where(hdp => hdp.AgeBand.IsAggregate || inequalitiesList.Contains("age"))
                    .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                    .ToList(),
                IndicatorSegments = areaGroup.GroupBy(healthMeasure => new
                {
                    ageName = healthMeasure.AgeDimension.Name,
                    ageIsAggregate = healthMeasure.AgeDimension.IsAggregate,
                    sexName = healthMeasure.SexDimension.Name,
                    sexIsAggregate = healthMeasure.SexDimension.IsAggregate
                })
                .Select(segmentGroup => new IndicatorSegment
                {
                    Age = new Age { Value = segmentGroup.Key.ageName, IsAggregate = segmentGroup.Key.ageIsAggregate },
                    Sex = new Sex { Value = segmentGroup.Key.sexName, IsAggregate = segmentGroup.Key.sexIsAggregate },
                    IsAggregate = segmentGroup.Key.ageIsAggregate && segmentGroup.Key.sexIsAggregate,
                    HealthData = healthDataMapper.Map(segmentGroup.ToList())
                      .OrderBy(dataPoint => dataPoint.DatePeriod.From)
                      .ToList()
                })
                .OrderBy(segment => segment.Sex.Value)
                .ThenBy(segment => segment.Age.Value)
                .ToList()
            })
            .ToList();

        if (!benchmarkingRequired)
            return healthDataForAreas;

        // separate the data for results and data for performing benchmarks
        var benchmarkHealthData = benchmarkAgainstRefArea ? healthDataForAreas.FirstOrDefault(data => data.AreaCode == benchmarkAreaCode) : null;
        if (benchmarkAgainstRefArea && benchmarkHealthData == null)
            return healthDataForAreas;

        //if the benchmark area was not in the original request then remove the benchmark data
        if (addBenchmarkAreaToList)
            healthDataForAreas.RemoveAll(data => data.AreaCode == benchmarkAreaCode);

        if (benchmarkAgainstRefArea)
        {
            return BenchmarkComparisonEngine.PerformAreaBenchmarking
            (
                healthDataForAreas,
                benchmarkHealthData!,
                polarity
            );
        }
        else
        {
            return BenchmarkComparisonEngine.PerformInequalityBenchmarking
            (
               healthDataForAreas,
               polarity
            );
        }
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
        string benchmarkAreaCode,
        bool includeUnpublished = false
        )
    {
        var quartileData = await healthDataRepository.GetQuartileDataAsync
        (
            indicatorIds,
            areaCode,
            areaType,
            ancestorCode,
            benchmarkAreaCode,
            includeUnpublished
        );

        return quartileData == null ? null : healthDataMapper.Map(quartileData.ToList());
    }

    /// <summary>
    ///     Deletes all unpublished health measure data for a given indicator and batch ID.
    /// </summary>
    /// <param name="batchId">The batch ID associated with the unpublished data to delete.</param>
    /// <returns>
    ///     <c>ServiceResponse</c> indicating the result of the delete operation.
    ///     The response status will indicate success, batch not found, or an error if the batch is published or a database error occurs.
    /// </returns>
    public async Task<ServiceResponse<string>> DeleteUnpublishedDataAsync(string batchId)
    {
        bool result;
        try
        {
            result = await healthDataRepository.DeleteAllHealthMeasureByBatchIdAsync(batchId);
        }
        catch (InvalidOperationException exception)
        {
            return new ServiceResponse<string>()
            {
                Status = ResponseStatus.ErrorDeletingPublishedBatch,
                Content = exception.Message
            };
        }
        catch (DbUpdateException exception)
        {
            DbErrorLog(logger, batchId, exception.Message, exception);
            return new ServiceResponse<string>()
            {
                Status = ResponseStatus.Unknown
            };
        }

        DeleteSuccessLog(logger, batchId, null);
        return new ServiceResponse<string>()
        {
            Status = result ? ResponseStatus.Success : ResponseStatus.BatchNotFound,
        };
    }
}