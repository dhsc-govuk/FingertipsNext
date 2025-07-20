using System.Net;
using System.Net.Http.Headers;
using System.Net.Http.Json;
using DHSC.FingertipsNext.Modules.DataManagement.Repository.Models;
using DHSC.FingertipsNext.Modules.DataManagement.Schemas;
using Shouldly;

namespace DHSC.FingertipsNext.Api.IntegrationTests.DataManagement;

public sealed class ListBatchesIntegrationTests : DataManagementIntegrationTests
{
    private const string Indicator41101GroupRoleId = "90ac52f4-8513-4050-873a-24340bc89bd3";

    private static readonly Batch BatchFor41101 = new()
    {
        BatchId = "41101_2020-03-07T14:22:37.123",
        IndicatorId = 41101,
        Status = BatchStatus.Received,
        OriginalFileName = "list-batches-integration-test.csv",
        UserId = "4fbbbb61-ed6d-4777-943c-7d597f90445a",
        CreatedAt = new DateTime(2017, 6, 30, 18, 49, 37),
        PublishedAt = new DateTime(2025, 8, 9, 0, 0, 0, 0)
    };

    private static readonly Batch BatchFor383 = BatchFor41101 with
    {
        BatchId = "383_2017-06-30T14:22:37.123",
        IndicatorId = 383,
        Status = BatchStatus.Deleted,
        PublishedAt = new DateTime(2025, 9, 9, 0, 0, 0, 0)
    };

    private static readonly Batch BatchFor22401 = BatchFor41101 with
    {
        BatchId = "22401_2017-06-30T14:22:37.123",
        IndicatorId = 22401,
        PublishedAt = new DateTime(2025, 10, 9, 0, 0, 0, 0)
    };

    public ListBatchesIntegrationTests(DataManagementWebApplicationFactory<Program> factory) : base(factory)
    {
        InitialiseDb(Connection, "list-batches-setup.sql");
    }

    protected override void Dispose(bool disposing)
    {
        var cleanupPath = Path.Combine(AppContext.BaseDirectory, SqlScriptDirectory, "list-batches-cleanup.sql");
        RunSqlScript(cleanupPath, Connection);

        base.Dispose(disposing);
    }

    [Fact]
    public async Task ListBatchesEndpointShouldListAllBatchesForAdministrators()
    {
        // Arrange
        var expectedResult = new[] { BatchFor41101, BatchFor383, BatchFor22401 };

        var apiClient = Factory.CreateClient();
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([AdminRoleGuid]));

        // Act
        var response = await apiClient.GetFromJsonAsync<Batch[]>(new Uri("/batches", UriKind.Relative));

        // Assert
        response.ShouldBeEquivalentTo(expectedResult);
    }

    [Fact]
    public async Task ListBatchesEndpointShouldListOnlyBatchesForIndicatorsTheUserHasPermissionsFor()
    {
        // Arrange
        var expectedResult = new[] { BatchFor41101 };

        var apiClient = Factory.CreateClient();
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator41101GroupRoleId]));

        // Act
        var response = await apiClient.GetFromJsonAsync<Batch[]>(new Uri("/batches", UriKind.Relative));

        // Assert
        response.ShouldBeEquivalentTo(expectedResult);
    }

    [Fact]
    public async Task ListBatchesEndpointShouldListBatchesForAllIndicatorsTheUserHasPermissionsFor()
    {
        // Arrange
        var expectedResult = new[] { BatchFor41101, BatchFor383 };

        var apiClient = Factory.CreateClient();
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator41101GroupRoleId, Indicator383GroupRoleId]));

        // Act
        var response = await apiClient.GetFromJsonAsync<Batch[]>(new Uri("/batches", UriKind.Relative));

        // Assert
        response.ShouldBeEquivalentTo(expectedResult);
    }

    [Fact]
    public async Task ListBatchesEndpointShouldReturnForbiddenWhenTheUserHasNoPermissions()
    {
        // Arrange
        var apiClient = Factory.CreateClient();
        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken());

        // Act
        var response = await apiClient.GetAsync(new Uri("/batches", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Forbidden);
    }

    [Fact]
    public async Task UnauthorisedRequestToListBatchesEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();

        // Act
        var response = await apiClient.GetAsync(new Uri("/batches", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }

    [Fact]
    public async Task ExpiredRequestToListBatchesEndpointEndpointShouldBeRejected()
    {
        // Arrange
        var apiClient = Factory.CreateClient();


        apiClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Bearer",
            Factory.GenerateTestToken([Indicator41101GroupRoleId], true));

        // Act
        var response = await apiClient.GetAsync(new Uri("/batches", UriKind.Relative));

        // Assert
        response.StatusCode.ShouldBe(HttpStatusCode.Unauthorized);
    }
}