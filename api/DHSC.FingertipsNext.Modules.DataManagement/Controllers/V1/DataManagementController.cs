using System.Globalization;
using System.Web;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using DHSC.FingertipsNext.Modules.DataManagement.Service.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("indicators/{indicatorId:int}/data")]
[ProducesResponseType(StatusCodes.Status202Accepted)]
[ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public class DataManagementController(IDataManagementService dataManagementService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadHealthData([FromForm] IFormFile? file, [FromForm] string publishedAt, [FromRoute] int indicatorId)
    {
        if (file == null || file.Length == 0)
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "File is empty"
            });
        var untrustedFileName = Path.GetFileName(file.FileName);
        var encodedUntrustedFileName = HttpUtility.HtmlEncode(untrustedFileName);
        
        if (!DateTime.TryParse(publishedAt, CultureInfo.InvariantCulture, DateTimeStyles.RoundtripKind, out DateTime parsedPublishedAt))
        {
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "publishedAt is invalid. Must be in the format dd-MM-yyyyTHH:mm:ss.fff"
            });
        }

        parsedPublishedAt = parsedPublishedAt.ToUniversalTime();

        if (parsedPublishedAt <= DateTime.UtcNow)
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
                return new BadRequestObjectResult(new ErrorWithDetail
                {
                    Message = "The CSV file provided was invalid.",
                    Errors = validationErrors
                });
        }

        // Will need to re-initialise fileStream as it will have been disposed during ValidateCsv
        await using (var fileStream = file.OpenReadStream())
        {
            response = await dataManagementService.UploadFileAsync(fileStream, indicatorId, parsedPublishedAt, encodedUntrustedFileName);
        }
        return (response.Outcome) switch
        {
            OutcomeType.Ok => new AcceptedResult
            {
                StatusCode = StatusCodes.Status202Accepted,
                Value = $"File {encodedUntrustedFileName} has been accepted for indicator {indicatorId}."
            },
            _ => StatusCode(StatusCodes.Status500InternalServerError, "File upload was unsuccessful.")
        };
    }
}