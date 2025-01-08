using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas
{
    [Serializable]
    public class HealthMeasure
    {
        public required int HealthMeasureKey { get; set; }
        public required AreaDimension AreaDimension { get; set; }
        public required IndicatorDimension IndicatorDimension  { get; set; }
        public required SexDimension SexDimension { get; set; }
        public required AgeDimension AgeDimension { get; set; }
        public required double Count { get; set; }
        public required double Value { get; set; }
        public required double LowerCI { get; set; }
        public required double UpperCI { get; set; }
        public required int Year { get; set; }
    }
}
