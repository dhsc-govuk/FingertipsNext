using Asp.Versioning;
using DHSC.FingertipsNext.Modules.Core.ModuleInterfaces;
using DHSC.FingertipsNext.Modules.Core.Service;
using Microsoft.AspNetCore.Mvc;

namespace DHSC.FingertipsNext.Modules.Core.Controllers.V1;

[ApiController]
[Route("[controller]")]
[ApiVersion("1.0")]
public class CoreController : ControllerBase, ICoreController
{
    private readonly ILogger<CoreController> _logger;
    private readonly IWeatherFactory _factory;
    private readonly ICoreService _coreService;
    
    public CoreController(ILogger<CoreController> logger, IWeatherFactory factory, ICoreService coreService)
    {
        _logger = logger;
        _factory = factory;
        _coreService = coreService;
    }

    [HttpGet]
    [Route("forecast")]
    public IEnumerable<WeatherForecast> GetCoreForecast()
    {
        return Enumerable.Range(1, 5).Select(index => _factory.CreateWeather(index))
        .ToArray();
    }
    
    [HttpGet]
    [Route("search-forecast")]
    public string SearchForecast([FromQuery] string searchTerm)
    {
        try
        {
            throw new ArgumentException("Some logger message should go here!");

        }
        catch (Exception ex)
        {
            _logger.LogExample(ex, "search-forecast");
        }
        
        return _coreService.DoThing(searchTerm);
    }
}
