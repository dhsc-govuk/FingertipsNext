using DHSC.FingertipsNext.Modules.HealthData.Service;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace DHSC.FingertipsNext.Modules.HealthData.Controllers.V0;

[ApiController]
[Route("v0/indicators")]
[ProducesResponseType(StatusCodes.Status200OK)]
[ProducesResponseType(StatusCodes.Status400BadRequest)]
[ProducesResponseType(StatusCodes.Status500InternalServerError)]
public class IndicatorsController(IDataUploadService dataUploadService, IConfiguration configuration) : ControllerBase
{
    [HttpPost]
    [Route("upload")]
    public async Task<IActionResult> UploadFile(IFormFile? file)
    {
        if (file == null || file.Length == 0) return BadRequest();
        
        await using var stream = file.OpenReadStream();

        var response = await dataUploadService.UploadWithSdkAsync
            (stream, file.FileName, configuration.GetValue<string>("STORAGE_CONTAINER_NAME"));

        return response.Status switch
        {
            ResponseStatus.Success => Ok(),
            ResponseStatus.InvalidCsv => BadRequest(),
            _ => StatusCode(500)
        };
    }
    
    [HttpPost]
    [Route("upload_asStream")]
    [RequestSizeLimit(500_000_000)] // An alternative is using the attribute [DisableRequestSizeLimit] to disable the limit entirely 
    public async Task<IActionResult> UploadFile()
    {
        await using var stream = HttpContext.Request.Body;
        
        var response = await dataUploadService.UploadWithSdkAsync
            (stream, "big-file.csv", configuration.GetValue<string>("STORAGE_CONTAINER_NAME"));

        return response.Status switch
        {
            ResponseStatus.Success => Ok(),
            ResponseStatus.InvalidCsv => BadRequest(),
            _ => StatusCode(500)
        };
    }

    [HttpPost]
    [Route("upload_rest")]
    public async Task<IActionResult> UploadWithHttp(IFormFile? file)
    {
        if (file == null || file.Length == 0) return BadRequest();
        
        await using var stream = file.OpenReadStream();

        var accountName = configuration.GetValue<string>("STORAGE_ACCOUNT_NAME");
        var containerName = configuration.GetValue<string>("STORAGE_CONTAINER_NAME");
        var accountKey = configuration.GetValue<string>("STORAGE_ACCOUNT_KEY");
        
        var response = await dataUploadService.UploadWithRestAsync(stream, accountName, containerName, file.FileName, accountKey);

        return response.Status switch
        {
            ResponseStatus.Success => Ok(),
            ResponseStatus.InvalidCsv => BadRequest(),
            _ => StatusCode(500)
        };
    }
}