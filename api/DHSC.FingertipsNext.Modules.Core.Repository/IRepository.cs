using DHSC.FingertipsNext.Modules.Core.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Core.Repository;

public interface IRepository
{
    IEnumerable<HealthMeasure> GetIndicatorData(int indicatorId, string[]areaCodes, int[]years);
}