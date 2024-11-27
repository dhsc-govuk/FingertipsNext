using FluentAssertions;

namespace DHSC.FingertipsNext.Modules.Core.UnitTests;

public class CoreControllerTests
{
    [Fact]
    public void Test1()
    {
        bool results = true;
        results.Should().BeTrue();
    }
}