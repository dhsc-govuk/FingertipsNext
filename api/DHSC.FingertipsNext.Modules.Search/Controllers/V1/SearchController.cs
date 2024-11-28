using Microsoft.AspNetCore.Mvc;
using System.Diagnostics;
using System.Runtime.CompilerServices;
using DHSC.FingertipsNext.Modules.Search.Interfaces;

namespace DHSC.FingertipsNext.Modules.Search.Controllers.V1;

[ApiController]
[Route("[controller]")]
public class SearchController(ILogger<SearchController> logger) : ControllerBase, ISearchController
{
    private readonly ILogger<SearchController> _logger = logger;

    [HttpGet]
    public string Search([FromQuery] string searchTerm)
    {
        return $"You searched for {searchTerm}";
    }
}