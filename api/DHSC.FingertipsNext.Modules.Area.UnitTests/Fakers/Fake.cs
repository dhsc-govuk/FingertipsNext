using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public static class Fake
{
    public static AreaTypeModel AreaTypeModel => new AreaTypeModelFaker().Generate();

    public static AreaModel AreaModel => new AreaModelFaker().Generate();

    public static AreaWithRelationsModel AreaWithRelationsModel =>
        new AreaWithRelationsModelFaker().Generate();
}
