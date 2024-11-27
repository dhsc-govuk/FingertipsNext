using DHSC.FingertipsNext.Modules.Core.SearchAPI;

namespace DHSC.FingertipsNext.Modules.Core.Service;

public class CoreService : ICoreService
{
    private ISearchClient _searchClient;
    
    public CoreService(ISearchClient searchClient)
    {
        _searchClient = searchClient;
    }
    
    public string DoThing(string searchTerm)
    {
        return _searchClient.Search(searchTerm);
    }
}