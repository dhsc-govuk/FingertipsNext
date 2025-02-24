using Bogus;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public class AreaModelFaker: Faker<AreaModel>
{
    public AreaModelFaker()
    {
        StrictMode(true);
        RuleFor(a => a.Node, f => new HierarchyId());
        RuleFor(a => a.AreaKey, f => f.IndexFaker);
        RuleFor(a => a.AreaName, f => f.Lorem.Sentence(4));
        RuleFor(a => a.AreaCode, f => f.Random.Guid().ToString());
        RuleFor(a => a.AreaType, f => Fake.AreaTypeModel);
        RuleFor(a => a.AreaTypeKey, f => f.Lorem.Word());
    }
}
