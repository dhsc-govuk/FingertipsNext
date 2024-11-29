using DHSC.FingertipsNext.Modules.Core.SearchAPI;

namespace DHSC.FingertipsNext.Modules.Core.Service;

public class CoreService(ISearchClient searchClient) : ICoreService
{
    public string DoThing(string searchTerm)
    {
        return searchClient.Search(searchTerm);
    }
}