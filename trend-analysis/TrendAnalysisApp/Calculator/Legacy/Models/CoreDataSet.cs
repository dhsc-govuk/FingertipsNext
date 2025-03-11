using Newtonsoft.Json;

namespace TrendAnalysisApp.Calculator.Legacy.Models
{
  public class CoreDataSet : ValueWithCIsData, ICloneable
    {
        [System.Text.Json.Serialization.JsonIgnore]
        public bool IsCountValid
        {
            get { return Count.HasValue && Count != NullValue; }
        }

        [JsonProperty(PropertyName = "Denom")]
        public double Denominator { get; set; }

        [System.Text.Json.Serialization.JsonIgnore]
        public bool IsDenominatorValid
        {
            get { return Denominator > 0; }
        }

        [JsonProperty]
        public int Year { get; set; }
        
        public object Clone()
        {
            return MemberwiseClone();
        }
    }
}