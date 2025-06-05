using Bogus;
using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;

internal class AreaNoRelationsModelFaker : Faker<AreaModel>
{
    public AreaNoRelationsModelFaker()
    {
        RuleFor(a => a.AreaKey, f => f.IndexFaker);
        RuleFor(a => a.AreaName, f => f.Lorem.Sentence(4));
        RuleFor(a => a.AreaCode, f => f.Random.Guid().ToString());
        RuleFor(a => a.AreaType, f => Fake.AreaTypeModel);
    }
}
