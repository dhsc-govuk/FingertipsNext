using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Repository.Models
{
    [Serializable]
    public class HealthMeasure
    {
        [Key]
        public required int HealthMeasureKey { get; set; }
        public required int AreaKey { get; set; }
        public required short IndicatorKey  { get; set; }
        public required byte SexKey { get; set; }
        public required short AgeKey { get; set; }
        public required double Count { get; set; }
        public required double Value { get; set; }
        public required double LowerCI { get; set; }
        public required double UpperCI { get; set; }
        public required short Year { get; set; }
    }
}
