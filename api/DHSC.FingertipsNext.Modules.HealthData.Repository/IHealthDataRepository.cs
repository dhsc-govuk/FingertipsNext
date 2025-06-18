using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IHealthDataRepository
{
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string[] inequalities);

    Task<IEnumerable<DenormalisedHealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string areaTypeKey,
                                                                 string benchmarkAreaCode);

    Task<IndicatorDimensionModel?> GetIndicatorDimensionAsync(int indicatorId, string[] areaCodes);
    Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode, string areaTypeKey, string ancestorCode, string benchmarkAreaCode);

    Task<IEnumerable<AreaDimensionModel>> GetAreasAsync(string[] areaCodes);
}
