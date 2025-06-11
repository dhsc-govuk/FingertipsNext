using Shouldly;
namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests;

public class ModuleTests
{
    private readonly DataManagementModule _module = new();
    [Fact]
    public void ModuleIsNamedDataManager()
    {
        _module.ModuleName.ShouldBe("DataManagement");
    }
}