using DHSC.FingertipsNext.Modules.Core.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Core.Repository;

public interface IRepository
{
    HealthMeasure? GetFirstHealthMeasure();
}