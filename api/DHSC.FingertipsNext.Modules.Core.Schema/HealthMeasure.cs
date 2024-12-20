using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Schema
{
    [Serializable]
    public class HealthMeasure
    {
        [Key]
        public required int HealthMeasureKey { get; set; }
        public AreaDimension AreaDimension { get; set; }
        public IndicatorDimension IndicatorDimension  { get; set; }
        public SexDimension SexDimension { get; set; }
        public AgeDimension AgeDimension { get; set; }
        public required double Count { get; set; }
        public required double Value { get; set; }
        public required double LowerCi { get; set; }
        public required double UpperCi { get; set; }
        public required int Year { get; set; }
    }
}
