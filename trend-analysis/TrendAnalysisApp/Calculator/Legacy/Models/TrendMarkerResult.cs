using Newtonsoft.Json;

namespace TrendAnalysisApp.Calculator.Legacy.Models
{
    public class TrendMarkerResult
    {
        [JsonProperty]
        public TrendMarker Marker { get; set; }

        [JsonProperty("PointsUsed")]
        public int NumberOfPointsUsedInCalculation { get; set; }

        [JsonIgnore]
        public double ChiSquare { get; set; }

        [JsonIgnore]
        public bool IsSignificant { get; set; }

        [JsonProperty]
        public string Message { get; set; }
    }
}