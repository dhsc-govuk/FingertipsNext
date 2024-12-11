using DHSC.FingertipsNext.Modules.Indicators.Controllers;
using DHSC.FingertipsNext.Modules.Indicators.ModuleInterfaces;
using FluentAssertions;
using Microsoft.Extensions.DependencyInjection;
using NSubstitute;

namespace DHSC.FingertipsNext.Modules.Indicators.Tests;

public class ModuleTests
{
    private readonly Module _module = new Module();
    
    [Fact]
    public void ModuleName_IsNamed_Indicators()
    {
        _module.ModuleName.Should().Be("indicators");
    }

    [Fact(Skip = "don't know how to test extension method")]
    public void Module_Registers_IndicatorsController()
    {
        var serviceCollection = Substitute.For<IServiceCollection>();
        _module.RegisterModule(serviceCollection);

    }
}