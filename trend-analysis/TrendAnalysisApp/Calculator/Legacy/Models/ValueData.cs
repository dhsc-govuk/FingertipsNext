using Newtonsoft.Json;

namespace TrendAnalysisApp.Calculator.Legacy.Models
{
    public class ValueData
    {
        public const double NullValue = -1.0;

        [JsonProperty(PropertyName = "Val")]
        public double Value { get; set; }

        [JsonProperty(PropertyName = "Count")]
        public double? Count { get; set; }
        
        [JsonIgnore]
        public bool IsValueValid
        {
            get { return Value != NullValue; }
        }
    }
}