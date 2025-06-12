using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
     
     private readonly DataManagementController _controller;
     private readonly IDataManagementService _dataManagementService;

     public DataManagementControllerTests()
     {
          _dataManagementService = Substitute.For<IDataManagementService>();
          _controller = new DataManagementController(_dataManagementService);
     }
     
     [Fact]
     public void HealthcheckReturns200()
     { 
          // act
          var response = _controller.Healthcheck() as OkObjectResult;
          // assert
          response?.StatusCode.ShouldBe(200);
     }
     [Fact]
     public void HealthcheckReturnsExpectedResult()
     {
          // act
          var response = _controller.Healthcheck() as OkObjectResult;
          // assert
          response?.Value.ShouldBe("Hello");
     }
}