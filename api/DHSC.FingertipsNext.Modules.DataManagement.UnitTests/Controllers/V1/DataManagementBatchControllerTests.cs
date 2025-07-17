using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
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

    [Theory]
    [InlineData("", "batchId is required")]
    public async Task DeleteReturnsBadRequest(string batchId, string expectedErrorMessage)
    {
        // Act
        var result = await _controller.DeleteBatch(batchId) as BadRequestObjectResult;

        // Assert
        result.StatusCode.ShouldBe(StatusCodes.Status400BadRequest);

        var resultValue = result.Value as SimpleError;
        resultValue.Message.ShouldBe(expectedErrorMessage);
    }

    [Theory]
    [InlineData("Not found", "Not found", StatusCodes.Status404NotFound)]
    [InlineData(null, "An unexpected error occurred", StatusCodes.Status400BadRequest)]
    public async Task DeleteReturnsErrorWhenServiceReturnsAClientError(string? errors, string expectedErrorMessage, int expectedStatusCode)
    {
        // Arrange
        List<string>? listToReturn;
        if (errors != null && !string.IsNullOrEmpty(expectedErrorMessage))
        {
            listToReturn = (List<string>)[errors];
        }
        else
        {
            listToReturn = null;
        }

        var response = new UploadHealthDataResponse(OutcomeType.ClientError, null, listToReturn);
        _dataManagementService.DeleteBatchAsync(Arg.Any<string>(), Arg.Any<Guid>()).Returns(response);

        // Act
        var result = await _controller.DeleteBatch("1234_2025-01-01T00:00:00.000") as ObjectResult;

        // Assert
        result.StatusCode.ShouldBe(expectedStatusCode);

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