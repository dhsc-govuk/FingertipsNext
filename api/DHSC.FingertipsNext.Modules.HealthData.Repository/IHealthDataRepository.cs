using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IHealthDataRepository
{
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string[] inequalities,
                                                                 string? fromDate = null,
                                                                 string? toDate = null);

    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string areaTypeKey,
                                                                 string benchmarkAreaCode,
                                                                 string? fromDate = null,
                                                                 string? toDate = null);

    Task<IndicatorDimensionModel?> GetIndicatorDimensionAsync(int indicatorId, string[] areaCodes);
    Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode, string areaTypeKey, string ancestorCode, string benchmarkAreaCode);

    Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes);
}
