using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.Repository.Dimensions.Models
{
    [Serializable]
    public sealed class SexDimension
    {
        public required string Name { get; set; }
        public required bool IsFemale { get; set; }
        public required bool HasValue { get; set; }
        public required byte  SexID { get; set; }
    }
}
