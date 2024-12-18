using FluentAssertions;

namespace DHSC.FingertipsNext.Modules.Indicators.Tests;

public class ModuleTests
{
    private readonly Module _module = new Module();
    
    [Fact]
    public void ModuleName_IsNamed_Indicators()
    {
        _module.ModuleName.Should().Be("indicators");
    }
}