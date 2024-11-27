using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using DHSC.FingertipsNext.Modules.Search.Interfaces;

namespace DHSC.FingertipsNext.Modules.Search.Controllers.V1;

[ApiController]
[Route("[controller]")]
public class SearchController : ControllerBase, ISearchController
{
    private readonly ILogger<SearchController> _logger;

    public SearchController(ILogger<SearchController> logger)
    {
        _logger = logger;
    }

    [HttpGet]
    public string Search([FromQuery] string searchTerm)
    {
        return $"You searched for {searchTerm}";
    }
}