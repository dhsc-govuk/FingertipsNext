using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http.Internal;
using Microsoft.AspNetCore.Mvc;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementControllerTests
{
    private readonly DataManagementController _controller;
    private readonly int stubIndicatorId = 123;

    public DataManagementControllerTests()
    {
        _controller = new DataManagementController();
    }

    [Fact]
    public void PostReturnsExpectedResponseWhenGivenAValidFile()
    {
        // arrange
        var stubFileName = "StubHealthdataUpload.csv";
        var filePath = Path.Combine("TestData", stubFileName);
        var bytes = File.ReadAllBytes(filePath);
        var stream = new MemoryStream(bytes);
        var formFile = new FormFile(stream, 0, bytes.Length,
            "file", stubFileName);

        // act
        var response = _controller.UploadHealthData(formFile, stubIndicatorId) as OkObjectResult;
        // assert
        response?.StatusCode.ShouldBe(200);
        response?.Value.ToString().ShouldBe($"File {stubFileName} has been accepted for indicator {stubIndicatorId}.");
    }

    [Fact]
    public void NullFileReturns400()
    {
        // Act
        var result = _controller.UploadHealthData(null, stubIndicatorId) as BadRequestResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public void EmptyFileReturns400()
    {
        // Arrange
        var stream = new MemoryStream(); // no data
        var formFile = new FormFile(stream, 0, 0,
            "file", "empty.csv");

        // Act
        var result = _controller.UploadHealthData(formFile, stubIndicatorId) as BadRequestResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }
}