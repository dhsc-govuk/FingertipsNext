using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests;

public class ModuleTests
{
    private readonly HealthDataModule _module = new HealthDataModule();

    [Fact]
    public void ModuleNameIsNamedIndicators()
    {
        _module.ModuleName.ShouldBe("healthdata");
    }
}