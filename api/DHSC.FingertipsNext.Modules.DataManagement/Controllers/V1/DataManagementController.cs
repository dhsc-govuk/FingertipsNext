using System.Globalization;
using System.Security.Claims;
using System.Web;
using DHSC.FingertipsNext.Modules.Common.Auth;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("/indicators/{indicatorId:int}/data")]
public class DataManagementController(IDataManagementService dataManagementService, TimeProvider timeProvider) : ControllerBase
{
    private static string? GetUserId(ClaimsPrincipal user)
    {
        return user.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    [HttpPost]
    [ProducesResponseType(StatusCodes.Status202Accepted)]
    [ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    [Authorize(Policy = CanAdministerIndicatorRequirement.Policy)]
    [ProducesResponseType(StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status403Forbidden)]
    public async Task<IActionResult> UploadHealthData([FromForm] IFormFile? file, [FromForm] string publishedAt, [FromRoute] int indicatorId)
    {
        var userId = GetUserId(User);
        if (userId == null)
        {
            return new ForbidResult();
        }

        if (file == null || file.Length == 0)
        {
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "File is empty"
            });
        }

        var untrustedFileName = Path.GetFileName(file.FileName);
        var encodedUntrustedFileName = HttpUtility.HtmlEncode(untrustedFileName);

        if (!DateTime.TryParse(publishedAt, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out var parsedPublishedAt))
        {
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "publishedAt is invalid. Must be in the format dd-MM-yyyyTHH:mm:ss.fff"
            });
        }

        parsedPublishedAt = parsedPublishedAt.ToUniversalTime();

        if (parsedPublishedAt <= timeProvider.GetUtcNow())
        {
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "publishedAt cannot be in the past"
            });
        }

        UploadHealthDataResponse? response = null;
        await using (var fileStream = file.OpenReadStream())
        {
            var validationErrors = dataManagementService.ValidateCsv(fileStream);
            if (validationErrors.Count != 0)
            {
                return new BadRequestObjectResult(new ErrorWithDetail
                {
                    Message = "The CSV file provided was invalid.",
                    Errors = validationErrors
                });
            }
        }

        // Will need to re-initialise fileStream as it will have been disposed during ValidateCsv
        await using (var fileStream = file.OpenReadStream())
        {
            response = await dataManagementService.UploadFileAsync(fileStream, indicatorId, userId, parsedPublishedAt, encodedUntrustedFileName);
        }

        return response.Outcome switch
        {
            OutcomeType.Ok => new AcceptedResult
            {
                StatusCode = StatusCodes.Status202Accepted,
                Value = response.Model
            },
            _ => StatusCode(StatusCodes.Status500InternalServerError, "File upload was unsuccessful.")
        };
    }
}