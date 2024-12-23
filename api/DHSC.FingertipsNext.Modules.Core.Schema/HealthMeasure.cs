using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore.Infrastructure;

namespace DHSC.FingertipsNext.Modules.Core.Schema
{
    [Serializable]
    public class HealthMeasure
    {
        [Key]
        public required int HealthMeasureKey { get; set; }
        public required AreaDimension AreaDimension { get; set; }
        public required IndicatorDimension IndicatorDimension  { get; set; }
        public required SexDimension SexDimension { get; set; }
        public required AgeDimension AgeDimension { get; set; }
        public required double Count { get; set; }
        public required double Value { get; set; }
        public required double LowerCi { get; set; }
        public required double UpperCi { get; set; }
        public required int Year { get; set; }
    }
}
