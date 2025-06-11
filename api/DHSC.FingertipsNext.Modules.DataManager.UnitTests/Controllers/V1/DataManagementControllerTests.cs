using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
     private readonly DataManagementController _controller;

     public DataManagementControllerTests()
     {
          _controller = new DataManagementController();
     }
     

     [Fact]
     public void SayHelloTest()
     {
          // assert
          _controller.SayHello().ShouldBe("Hello");
     }
     
}