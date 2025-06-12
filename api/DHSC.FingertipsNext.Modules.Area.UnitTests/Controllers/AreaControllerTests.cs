using DHSC.FingertipsNext.Modules.Area.Controllers.V1;
using DHSC.FingertipsNext.Modules.Area.Schemas;
using DHSC.FingertipsNext.Modules.Area.Service;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.Area.UnitTests.Controllers;

public class AreaControllerTests
{
    private readonly IAreaService _mockService;
    private readonly AreaController _controller;

    public AreaControllerTests()
    {
        _mockService = Substitute.For<IAreaService>();

        _controller = new AreaController(_mockService);
    }


    [Fact]
    public async Task PassingANullHierarchyTypeFilterShouldReturnAllAreaTypes()
    {
        _mockService.GetAreaTypes(Arg.Any<string>()).Returns([]);
        _mockService.GetAllAreaTypes().Returns([new AreaType() { HierarchyName = "Name1", Key = "Key1", Level = 0, Name = "Name1" }]);

        var result = await _controller.GetAreaTypesAsync();

        var okResult = result as OkObjectResult;
        var resultList = okResult?.Value as List<AreaType>;

        resultList?.Count.ShouldBe(1, "Should contain single result");
    }

    [Fact]
    public async Task PassingAHierarchyTypeFilterShouldReturnFilteredAreaType()
    {
        _mockService.GetAllAreaTypes().Returns([]);
        _mockService.GetAreaTypes(Arg.Any<string>()).Returns([new AreaType() { HierarchyName = "Name2", Key = "Key2", Level = 0, Name = "Name2" }]);

        var result = await _controller.GetAreaTypesAsync("value");

        var okResult = result as OkObjectResult;
        var resultList = okResult?.Value as List<AreaType>;

        resultList?.Count.ShouldBe(1, "Should contain single result");
    }

    [Fact]
    public async Task EmptyAreaDetailsShouldReturnNotFoundError()
    {
        _mockService.GetAllAreaTypes().Returns([]);
        _mockService.GetAreaTypes(Arg.Any<string>()).Returns([new AreaType() { HierarchyName = "Name2", Key = "Key2", Level = 0, Name = "Name2" }]);

        var result = await _controller.GetAreaDetailsAsync("value");

        var okResult = result as OkObjectResult;
        var resultList = okResult?.Value as List<AreaType>;

        resultList?.Count.ShouldBe(1, "Should contain single result");
    }

    [Fact]
    public async Task NotProvidingAreaCodeShouldReturn400BadRequest()
    {
        var result = await _controller.GetMultipleAreaDetailsAsync();

        var badResult = result as BadRequestObjectResult;

        badResult.ShouldNotBeNull("Should return a bad request with no area_codes parameter Supplied");
    }

    [Fact]
    public async Task ProvidingTooManyAreaCodesShouldReturn400BadRequest()
    {
        string[] parameters = new string[301];

        var result = await _controller.GetMultipleAreaDetailsAsync(parameters);

        var badResult = result as BadRequestObjectResult;

        badResult.ShouldNotBeNull("Should return a bad request with no more than Max Number of areas provided");
    }

    [Fact]
    public async Task EmptyAreaDetailsShouldReturnNotFound()
    {
        _mockService.GetMultipleAreaDetails(Arg.Any<string[]>()).Returns([]);

        var result = await _controller.GetMultipleAreaDetailsAsync(["value"]);

        var notFoundResult = result as NotFoundResult;

        notFoundResult.ShouldNotBeNull("Should return a bad request with no more than Max Number of areas provided");
    }

    [Fact]
    public async Task AreaDetailsShouldReturnValuesFromService()
    {
        _mockService.GetMultipleAreaDetails(Arg.Any<string[]>()).Returns([new AreaData() { AreaType = new AreaType() { Name = "name", HierarchyName = "hierarchy", Key = "key", Level = 0 }, Code = "code", Name = "name" }]);

        var result = await _controller.GetMultipleAreaDetailsAsync(["value"]);

        var okResult = result as OkObjectResult;
        var resultList = okResult?.Value as List<AreaType>;

        resultList?.Count.ShouldBe(1);
    }

    [Fact]
    public async Task GetAreaDetailsForAreaTypeAsyncShouldReturnNotFoundWhenNoAreaDetailsAreFound()
    {
        _mockService.GetAreaDetailsForAreaType(Arg.Any<string>()).Returns([]);

        var result = await _controller.GetAreaDetailsForAreaTypeAsync("value");

        var notFoundResult = result as NotFoundResult;

        notFoundResult.ShouldNotBeNull();
    }

    [Fact]
    public async Task GetAreaDetailsForAreaTypeAsyncShouldReturnValuesWhenAreaDetailsAreFound()
    {
        _mockService.GetAreaDetailsForAreaType(Arg.Any<string>()).Returns([
            new AreaData()
            {
                AreaType = new AreaType() { HierarchyName = "name", Key = "", Name = "", Level = 0 },
                Name = "areaname",
                Code = "code"
            }
        ]);

        var result = await _controller.GetAreaDetailsForAreaTypeAsync("value");

        var notFoundResult = result as OkObjectResult;

        notFoundResult.ShouldNotBeNull();
    }
}