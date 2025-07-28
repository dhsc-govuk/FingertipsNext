using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IHealthDataRepository
{
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId,
        string[] areaCodes,
        int[] years,
        string[] inequalities,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false);

    Task<IEnumerable<DenormalisedHealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(
        int indicatorId,
        string[] areaCodes,
        int[] years,
        string areaTypeKey,
        string benchmarkAreaCode,
        DateOnly? fromDate = null,
        DateOnly? toDate = null,
        bool includeUnpublished = false);

    Task<IndicatorDimensionModel?> GetIndicatorDimensionAsync(int indicatorId, string[] areaCodes,
        bool includeUnpublished = false);

    Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode,
        string areaTypeKey, string ancestorCode, string benchmarkAreaCode, bool includeUnpublished = false);

    Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes);
    Task DeleteAllHealthMeasureByBatchIdAsync(string batchId);
}