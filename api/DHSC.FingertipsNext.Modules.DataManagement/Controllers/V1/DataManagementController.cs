using System.Runtime.InteropServices.JavaScript;
using System.Web;
using DHSC.FingertipsNext.Modules.Common.Schemas;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("indicators/{indicatorId:int}/data")]
[ProducesResponseType(StatusCodes.Status202Accepted)]
[ProducesResponseType(typeof(SimpleError), StatusCodes.Status400BadRequest)]
public class DataManagementController : ControllerBase
{
    [HttpPost]
    [System.Diagnostics.CodeAnalysis.SuppressMessage("Performance", "CA1822", Justification = "Controller actions must not be static. It is anticipated that this can be removed as full behaviour is added and _service is passed.")]
    public IActionResult UploadHealthData([FromForm] IFormFile? file, int indicatorId)
    {
        if (file == null || file.Length == 0)
            return new BadRequestObjectResult(new SimpleError
            {
                Message = "File is empty"
            });
        var untrustedFileName = Path.GetFileName(file.FileName);
        var encodedUntrustedFileName = HttpUtility.HtmlEncode(untrustedFileName);

        return new AcceptedResult
        {
            StatusCode = StatusCodes.Status202Accepted,
            Value = $"File {encodedUntrustedFileName} has been accepted for indicator {indicatorId}."
        };

    }
}