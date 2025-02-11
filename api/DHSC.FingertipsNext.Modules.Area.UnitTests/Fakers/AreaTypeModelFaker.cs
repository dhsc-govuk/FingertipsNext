using Bogus;
using DHSC.FingertipsNext.Modules.Area.Repository.Models;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Fakers;

public class AreaTypeModelFaker: Faker<AreaTypeModel>
{
    public AreaTypeModelFaker()
    {
        StrictMode(true);
        RuleFor(a => a.AreaTypeKey, f => f.Lorem.Word());
        RuleFor(a => a.AreaTypeName, f => f.Lorem.Word());
        RuleFor(a => a.HierarchyType, f => f.Lorem.Word());
        RuleFor(a => a.Level, f => f.Random.Int(0, 10));
    }

}