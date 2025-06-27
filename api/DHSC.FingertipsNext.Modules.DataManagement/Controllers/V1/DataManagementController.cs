using System.Web;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("indicators/{indicatorId:int}/data")]
[ProducesResponseType(StatusCodes.Status202Accepted)]
[ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public class DataManagementController(IDataManagementService dataManagementService) : ControllerBase
{
    [HttpPost]
    public async Task<IActionResult> UploadHealthData([FromForm] IFormFile? file, [FromRoute] int indicatorId)
    {
        if (file == null || file.Length == 0)
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "File is empty"
            });
        var untrustedFileName = Path.GetFileName(file.FileName);
        var encodedUntrustedFileName = HttpUtility.HtmlEncode(untrustedFileName);

        await using var fileStream = file.OpenReadStream();

        var isSuccess = await dataManagementService.UploadFileAsync(fileStream, indicatorId);

        return isSuccess switch
        {
            true => new AcceptedResult
            {
                StatusCode = StatusCodes.Status202Accepted,
                Value = $"File {encodedUntrustedFileName} has been accepted for indicator {indicatorId}."
            },
            _ => StatusCode(StatusCodes.Status500InternalServerError, "File upload was unsuccessful.")
        };
    }
}