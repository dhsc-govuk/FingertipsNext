using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
    private readonly IDataManagementRepository _dataManagementRepository;
    private readonly IDataManagementService _dataManagementService;
    private readonly DataManagementController _controller;

    public DataManagementControllerTests()
    {
        _dataManagementRepository = new DataManagementRepository();
        _dataManagementService = new DataManagementService(_dataManagementRepository);
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
        response?.Value.ShouldBe("The Repository says: I'm a Repository");
    }
}