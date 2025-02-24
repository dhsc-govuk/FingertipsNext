using Bogus;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public class AreaWithRelationsModelFaker : Faker<AreaWithRelationsModel>
{
    public AreaWithRelationsModelFaker()
    {
        StrictMode(true);

        RuleFor(a => a.Area, _ => Fake.AreaModel);
        RuleFor(a => a.ParentAreas, _ => new List<AreaModel> { Fake.AreaModel, Fake.AreaModel });
        RuleFor(a => a.Children, _ => new List<AreaModel> { Fake.AreaModel, Fake.AreaModel });
        RuleFor(a => a.Ancestors, _ => new List<AreaModel> { Fake.AreaModel, Fake.AreaModel });
        RuleFor(a => a.Siblings, _ => new List<AreaModel> { Fake.AreaModel, Fake.AreaModel });
    }
}
