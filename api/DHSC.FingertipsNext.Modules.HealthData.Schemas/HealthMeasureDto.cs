using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas
{
    [Serializable]
    public class HealthMeasureDto
    {
        [Key]
        public required int HealthMeasureKey { get; set; }
        public required AreaDimensionDto AreaDimension { get; set; }
        public required IndicatorDimensionDto IndicatorDimension  { get; set; }
        public required SexDimensionDto SexDimension { get; set; }
        public required AgeDimensionDto AgeDimension { get; set; }
        public required double Count { get; set; }
        public required double Value { get; set; }
        public required double LowerCi { get; set; }
        public required double UpperCi { get; set; }
        public required int Year { get; set; }
    }
}
