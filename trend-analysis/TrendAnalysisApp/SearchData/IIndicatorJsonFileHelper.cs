using Newtonsoft.Json.Linq;

namespace TrendAnalysisApp.SearchData;

public interface IIndicatorJsonFileHelper
{
    public JArray Read(string filePath);

    public void Write(string filePath, JArray fileContents);
}
