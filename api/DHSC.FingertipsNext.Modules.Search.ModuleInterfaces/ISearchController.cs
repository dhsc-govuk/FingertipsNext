namespace DHSC.FingertipsNext.Modules.Search.ModuleInterfaces;

/// <summary>
/// Sample interface for cross-module communication to interface with the search module 
/// </summary>
/// <param name="searchTerm">The term to search for.</param>
public interface ISearchController
{
    public string Search(string searchTerm);
}