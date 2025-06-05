using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;

internal static class Fake
{
    public static AreaTypeModel AreaTypeModel => new AreaTypeModelFaker().Generate();

    public static AreaModel AreaModel => new AreaModelFaker().Generate();

    public static AreaWithRelationsModel AreaWithRelationsModel =>
        new AreaWithRelationsModelFaker().Generate();

    public static AreaModel AreaNoRelationsModel =>
        new AreaNoRelationsModelFaker().Generate();
}
