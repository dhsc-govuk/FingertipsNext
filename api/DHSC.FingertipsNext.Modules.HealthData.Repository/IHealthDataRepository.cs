using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;
using DHSC.FingertipsNext.Modules.HealthData.Schemas;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IHealthDataRepository
{
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string[] inequalities); 
                                                                 
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintileBenchmarkComparisonAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string areaType);

    Task<IndicatorDimensionModel> GetIndicatorDimensionAsync(int indicatorId);
    Task<IEnumerable<QuartileDataModel>> GetQuartileDataAsync(IEnumerable<int> indicatorIds, string areaCode, string areaTypeKey, string ancestorCode);
}
