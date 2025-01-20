using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.Repository;

public interface IAreaRepository
{
    Task <IReadOnlyCollection<AreaModel>> GetAreaData(string areaCode);
}