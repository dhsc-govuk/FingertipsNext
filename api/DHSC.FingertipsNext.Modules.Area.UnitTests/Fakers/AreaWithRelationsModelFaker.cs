using Bogus;
using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;

internal class AreaWithRelationsModelFaker : Faker<AreaWithRelationsModel>
{
    public AreaWithRelationsModelFaker()
    {
        StrictMode(true);

        RuleFor(areaWithRelations => areaWithRelations.Area, _ => Fake.AreaModel);
        RuleFor(areaWithRelations => areaWithRelations.ParentAreas, _ => [Fake.AreaModel, Fake.AreaModel]);
        RuleFor(areaWithRelations => areaWithRelations.Children, _ => [Fake.AreaModel, Fake.AreaModel]);
        RuleFor(areaWithRelations => areaWithRelations.Siblings, _ => [Fake.AreaModel, Fake.AreaModel]);
    }
}
