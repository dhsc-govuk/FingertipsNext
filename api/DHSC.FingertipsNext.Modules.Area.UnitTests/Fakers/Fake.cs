using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public static class Fake
{
    public static AreaTypeModel AreaTypeModel => new AreaTypeModelFaker().Generate();
    
    public static AreaModel AreaModel => new AreaModelFaker().Generate();
    
    // TODO: do this using faker rules so can use Strict(true)
    public static AreaWithRelationsModel AreaWithRelationsModel =>
        new AreaWithRelationsModel
        {
            Area = AreaModel,
            ParentArea = AreaModel,
            Children = [AreaModel, AreaModel],
            Ancestors = [AreaModel, AreaModel],
            Siblings = [AreaModel, AreaModel],
        };
}
