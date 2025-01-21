using Shouldly;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests;

public class ModuleTests
{
    private readonly Module _module = new Module();
    
    [Fact]
    public void ModuleName_IsNamed_Indicators()
    {
        _module.ModuleName.ShouldBe("healthdata");
    }
}