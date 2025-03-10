
using TrendAnalysisApp.Calculator.Legacy.Models;
using Newtonsoft.Json;

namespace TrendAnalysisApp.Calculator.Legacy
{
    public class ValueWithCIsData : ValueData
    {
        [JsonProperty(PropertyName = "LoCI")]
        public double? LowerCI95 { get; set; }

        [JsonProperty(PropertyName = "UpCI")]
        public double? UpperCI95 { get; set; }
    }
}
