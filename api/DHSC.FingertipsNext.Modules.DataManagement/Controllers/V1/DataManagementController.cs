using System.Runtime.InteropServices.JavaScript;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.DataManagement.Controllers.V1;

[ApiController]
[Route("indicators/{indicatorId:int}/data")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(typeof(JSType.Error), StatusCodes.Status400BadRequest)]
public class DataManagementController() : ControllerBase
{
    [HttpPost]
    public IActionResult AcceptFile([FromForm] IFormFile? file)
    {
        if (file == null || file.Length == 0) return BadRequest();

        // using var reader = new StreamReader(file.OpenReadStream());
        // using var csv = new CsvReader(reader, new CultureInfo("en-GB"));

        return Ok($"File {file.FileName} has been accepted.");
    }
}