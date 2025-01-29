using Bogus;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public class AreaModelFaker: Faker<AreaModel>
{
    public AreaModelFaker()
    {
        StrictMode(true);
        RuleFor(a => a.AreaName, f => f.Lorem.Sentence(4));
        RuleFor(a => a.AreaCode, f => f.Random.Guid().ToString());
        RuleFor(a => a.AreaType, f => f.Lorem.Word());
        RuleFor(a => a.HierarchyType, f => f.Lorem.Word());
        RuleFor(a => a.Level, f => f.Random.Int(0, 10));
        RuleFor(a => a.Node, f => new HierarchyId());
    }
}
