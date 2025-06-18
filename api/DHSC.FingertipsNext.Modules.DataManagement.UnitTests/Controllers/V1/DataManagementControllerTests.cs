using System.Web;
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
        var result = _controller.UploadHealthData(null, stubIndicatorId) as BadRequestObjectResult;

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
        var result = _controller.UploadHealthData(formFile, stubIndicatorId) as BadRequestObjectResult;

        // Assert
        result.ShouldNotBeNull();
        result.StatusCode.ShouldBe(400);
    }

    [Fact]
    public void PostReturnsEncodedFilenameInResponse()
    {
        // Arrange
        var stubFileName = "Stub Healthdata Üpload.csv"; // filename with space and non-ASCII for encoding check
        var csv = @"area_code,date_from,date_to,period_type,sex,age_from_years_inclusive,age_to_years_inclusive,deprivation_decile,deprivation_category,count,value,denominator,lower_ci_95,upper_ci_95,lower_ci_99_8,upper_ci_99_8
E123456,2020-01-01,2020-12-31,Year,Male,18,64,3,Category,100,50,200,45,55,44,56";

        var bytes = System.Text.Encoding.UTF8.GetBytes(csv);
        var stream = new MemoryStream(bytes);
        var formFile = new FormFile(stream, 0, bytes.Length, "file", stubFileName);
        var expectedEncoded = HttpUtility.HtmlEncode(stubFileName);

        // Act
        var response = _controller.UploadHealthData(formFile, stubIndicatorId) as OkObjectResult;

        // Assert
        response?.StatusCode.ShouldBe(200);
        (response?.Value.ToString() ?? string.Empty).ShouldContain(expectedEncoded);
    }
}