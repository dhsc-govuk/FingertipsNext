using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IHealthDataRepository
{
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years,
                                                                 string[] inequalities); 
    Task<IEnumerable<HealthMeasureModel>> GetIndicatorDataWithQuintilesAsync(int indicatorId,
                                                                 string[] areaCodes,
                                                                 int[] years);
}
