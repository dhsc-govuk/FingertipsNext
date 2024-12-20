using DHSC.FingertipsNext.Modules.Core.Repository;
using DHSC.FingertipsNext.Modules.Core.Repository.Models;


namespace DHSC.FingertipsNext.Modules.Core.Service
{
    public interface IHealthMeasureService
    {
        HealthMeasure? GetFirstHealthMeasure();
    }
}
