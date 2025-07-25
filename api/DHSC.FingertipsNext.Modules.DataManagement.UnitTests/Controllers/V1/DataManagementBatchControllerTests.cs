using System.Security.Claims;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementBatchControllerTests
{
    private readonly DataManagementBatchController _controller;
    private readonly IDataManagementService _dataManagementService;

    public DataManagementBatchControllerTests()
    {
        var configuration = new ConfigurationBuilder().AddInMemoryCollection(new Dictionary<string, string?>
        {
            ["ADMINROLE"] = "b36b971b-e91d-4a5d-b9de-5a4a3076382f"
        }).Build();
        var indicatorPermissionsService = Substitute.For<IIndicatorPermissionsLookupService>();
        _dataManagementService = Substitute.For<IDataManagementService>();
        _controller = new DataManagementBatchController(configuration, indicatorPermissionsService, _dataManagementService);

        // Mock the user and their permissions.
        var mockUser = Substitute.For<ClaimsPrincipal>();
        mockUser.FindFirst(ClaimTypes.NameIdentifier)
            .Returns(new Claim(ClaimTypes.NameIdentifier, "user-id"));
        var mockHttpContext = Substitute.For<HttpContext>();
        mockHttpContext.User = mockUser;
        var mockControllerContext = Substitute.For<ControllerContext>();
        mockControllerContext.HttpContext = mockHttpContext;
        _controller.ControllerContext = mockControllerContext;
        indicatorPermissionsService.GetIndicatorsForRoles(Arg.Any<IEnumerable<Guid>>()).Returns([1234]);
    }

    [Fact]
    public async Task DeleteReturnsOk()
    {
        // Arrange
        var expectedModel = new Batch
        {
            BatchId = "12345_2025-01-01T00:00:00.000",
            CreatedAt = new DateTime(2025, 1, 1, 0, 0, 0),
            DeletedAt = DateTime.UtcNow,
            DeletedUserId = Guid.NewGuid().ToString(),
            IndicatorId = 12345,
            OriginalFileName = "upload.csv",
            PublishedAt = DateTime.UtcNow.AddMonths(1),
            Status = BatchStatus.Received,
            UserId = Guid.NewGuid().ToString()
        };

        var expectedServiceResponse = new UploadHealthDataResponse(OutcomeType.Ok, expectedModel);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<IList<int>>()).Returns(expectedServiceResponse);

        // Act
        var response = await _controller.DeleteBatch("12345_2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        response.StatusCode.ShouldBe(StatusCodes.Status200OK);
        response.Value.ShouldBeEquivalentTo(expectedModel);
    }

    [Fact]
    public async Task DeleteReturnsBadRequest()
    {
        // Act
        var result = await _controller.DeleteBatch("") as BadRequestObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);

        var resultValue = result.Value as SimpleError;
        resultValue.Message.ShouldBe("batchId is required");
    }

    [Fact]
    public async Task DeleteReturns403ErrorWhenServiceReturnsAPermissionDeniedOutcome()
    {
        // Arrange
        const string errorMessage = "Permission denied when deleting batch";
        var response = new UploadHealthDataResponse(OutcomeType.PermissionDenied, null, [errorMessage]);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<IList<int>>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("1234_2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status403Forbidden);
        result.Value.ShouldBe(errorMessage);
    }

    [Fact]
    public async Task DeleteReturns404ErrorWhenServiceReturnsANotFoundOutcome()
    {
        // Arrange
        var response = new UploadHealthDataResponse(OutcomeType.NotFound);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<IList<int>>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("1234_2025-01-01T00:00:00.000") as NotFoundResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status404NotFound);
    }

    [Theory]
    [InlineData("Batch already published", "Batch already published")]
    [InlineData("Batch already deleted", "Batch already deleted")]
    [InlineData(null, "Invalid request")]
    public async Task DeleteReturns400ErrorWhenServiceReturnsAClientErrorutcome(string? errors,
        string expectedErrorMessage)
    {
        // Arrange
        var listToReturn = (List<string>)[errors!];


        var response = new UploadHealthDataResponse(OutcomeType.ClientError, null, listToReturn);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<IList<int>>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("1234_2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);

        var error = result.Value as SimpleError;
        error.Message.ShouldBe(expectedErrorMessage);
    }

    [Fact]
    public async Task DeleteReturns500WhenServiceReturnsAServerError()
    {
        var response = new UploadHealthDataResponse(OutcomeType.ServerError);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<string>(), Arg.Any<IList<int>>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
        result.Value.ShouldBe("An unexpected error occurred");
    }
}