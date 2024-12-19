using DHSC.FingertipsNext.Modules.Repository.Dimensions.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.Repository
{
    [Serializable]
    public sealed class HealthMeasure
    {
        public required AreaDimension AreaDimension { get; set; }
        public required IndicatorDimension IndicatorDimension { get; set; }
        public required SexDimension SexDimension { get; set; }
        public required AgeDimension AgeDimension { get; set; }
        public required float Count { get; set; }
        public required float Value { get; set; }
        public required float LowerCI { get; set; }
        public required float UpperCI { get; set; }
        public required short Year { get; set; }
    }
}
