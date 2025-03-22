using Newtonsoft.Json.Linq;

namespace TrendAnalysisApp.SearchData;

public class IndicatorJsonFileHelper : IIndicatorJsonFileHelper
{
    public JArray Read(string filePath)
    {
        return JArray.Parse(File.ReadAllText(filePath));
    }

    public void Write(string filePath, JArray json) {
        File.WriteAllText(filePath, json.ToString());
    }
}
