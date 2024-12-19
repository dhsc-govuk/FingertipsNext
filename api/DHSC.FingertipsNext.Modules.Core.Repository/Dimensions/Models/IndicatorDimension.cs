using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.Repository.Dimensions.Models
{
    [Serializable]
    public sealed class IndicatorDimension
    {
        public required string Name { get; set; }
        public required int IndicatorID { get; set; }
        public required DateTime StartDate {  get; set; }
        public required DateTime EndDate { get; set; }
    }
}
