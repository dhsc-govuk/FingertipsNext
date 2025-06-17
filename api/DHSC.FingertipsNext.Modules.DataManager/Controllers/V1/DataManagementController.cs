using System.Globalization;
using System.Runtime.InteropServices.JavaScript;
using CsvHelper;
using DHSC.FingertipsNext.Modules.DataManagement.Service;
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
        // Console.WriteLine($"Request content type: {Request.ContentType}");
        // Console.WriteLine($"Form field count: {Request.Form.Count}");
        // Console.WriteLine($"File: {file?.FileName}, Size: {file?.Length}");

        if (file == null || file.Length == 0) 
            return BadRequest("File is missing or empty");

        // using var reader = new StreamReader(file.OpenReadStream());
        // using var csv = new CsvReader(reader, new CultureInfo("en-GB"));
        
        return Ok($"File {file.FileName} has been accepted.");
    }
}