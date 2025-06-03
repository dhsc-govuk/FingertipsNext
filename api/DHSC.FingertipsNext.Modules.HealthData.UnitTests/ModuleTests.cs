using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests;

public class ModuleTests
{
    private readonly Module _module = new Module();

    [Fact]
    public void ModuleNameIsNamedIndicators()
    {
        _module.ModuleName.ShouldBe("healthdata");
    }
}