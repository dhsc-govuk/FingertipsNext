using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository;

public interface IRepository
{
    IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string[] areaCodes, int[] years);
}
