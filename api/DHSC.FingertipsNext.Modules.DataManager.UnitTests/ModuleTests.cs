using Shouldly;
namespace DHSC.FingertipsNext.Modules.DataManager.UnitTests;

public class ModuleTests
{
    private readonly DataManagerModule _module = new();
    [Fact]
    public void ModuleIsNamedDataManager()
    {
        _module.ModuleName.ShouldBe("DataManager");
    }
}