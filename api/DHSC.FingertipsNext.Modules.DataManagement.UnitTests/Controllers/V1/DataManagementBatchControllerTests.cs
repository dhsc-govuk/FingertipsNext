using DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
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
}