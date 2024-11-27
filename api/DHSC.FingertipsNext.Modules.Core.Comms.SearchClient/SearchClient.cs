using DHSC.FingertipsNext.Modules.Search.Interfaces;

namespace DHSC.FingertipsNext.Modules.Core.SearchAPI;

public class SearchClient(ISearchController search) : ISearchClient
{
    public string Search(string searchTerm)
    {
        return search.Search(searchTerm).ToString();
    }
}