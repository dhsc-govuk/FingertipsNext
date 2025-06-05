using Bogus;
using DHSC.FingertipsNext.Modules.AreaData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.AreaData.UnitTests.Fakers;

internal class AreaTypeModelFaker : Faker<AreaTypeModel>
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