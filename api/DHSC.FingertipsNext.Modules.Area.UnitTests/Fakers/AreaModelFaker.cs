using Bogus;
using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;

internal class AreaModelFaker : Faker<AreaModel>
{
    public AreaModelFaker()
    {
        StrictMode(true);
        RuleFor(a => a.AreaKey, f => f.IndexFaker);
        RuleFor(a => a.AreaName, f => f.Lorem.Sentence(4));
        RuleFor(a => a.AreaCode, f => f.Random.Guid().ToString());
        RuleFor(a => a.AreaType, f => Fake.AreaTypeModel);
        RuleFor(a => a.AreaTypeKey, f => f.Lorem.Word());
        RuleFor(a => a.Children, f => new List<AreaModel>());
        RuleFor(a => a.Parents, f => new List<AreaModel>());
    }
}
