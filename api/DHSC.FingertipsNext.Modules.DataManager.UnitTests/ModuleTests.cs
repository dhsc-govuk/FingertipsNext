using Shouldly;
namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests;

public class ModuleTests
{
    private readonly DataManagementModule _module = new();
    [Fact]
    public void ModuleIsNamedDataManagement()
    {
        _module.ModuleName.ShouldBe("DataManagement");
    }
}