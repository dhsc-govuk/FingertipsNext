using System.Net;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using DHSC.FingertipsNext.Modules.DataManagement.UnitTests.TestData;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using NSubstitute;
using Shouldly;

namespace DHSC.FingertipsNext.Modules.DataManagement.UnitTests.Controllers.V1;

public class DataManagementBatchControllerTests
{
    private readonly DataManagementBatchController _controller;
    private readonly IDataManagementService _dataManagementService;

    public DataManagementBatchControllerTests()
    {
        _dataManagementService = Substitute.For<IDataManagementService>();
        _controller = new DataManagementBatchController(_dataManagementService);
    }

    [Fact]
    public async Task ListBatchesReturnsTheExpectedResult()
    {
        // Arrange
        var expectedResponse = new[]
        {
            BatchExamples.Batch with { BatchId = "41101_2025-03-07T15:44:37.123Z" },
            BatchExamples.Batch with { BatchId = "383_2017-06-30T14:22:37.123Z" }
        };
        _dataManagementService.ListBatches([]).Returns(expectedResponse);

        // Act
        var response =
            await _controller.ListBatches() as OkObjectResult;

        // Assert
        response.ShouldNotBeNull();
        response.StatusCode?.ShouldBe(StatusCodes.Status200OK);
        response.Value.ShouldBeEquivalentTo(expectedResponse);
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
            UserId = Guid.NewGuid().ToString(),
        };

        var expectedServiceResponse = new UploadHealthDataResponse(OutcomeType.Ok, expectedModel);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>()).Returns(expectedServiceResponse);

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
    public async Task DeleteReturns404ErrorWhenServiceReturnsANotFoundOutcome()
    {
        // Arrange
        var response = new UploadHealthDataResponse(OutcomeType.NotFound);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("1234_2025-01-01T00:00:00.000") as NotFoundResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status404NotFound);
    }

    [Theory]
    [InlineData("Batch already published", "Batch already published")]
    [InlineData(null, "Invalid request")]
    public async Task DeleteReturns400ErrorWhenServiceReturnsAClientErrorutcome(string? errors, string expectedErrorMessage)
    {
        // Arrange
        var listToReturn = (List<string>)[errors!];


        var response = new UploadHealthDataResponse(OutcomeType.ClientError, null, listToReturn);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>()).Returns(response);

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
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status500InternalServerError);
        result.Value.ShouldBe("An unexpected error occurred");
    }
}