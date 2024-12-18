using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.Repository.Dimensions.Models
{
    [Serializable]
    public sealed class AgeDimension
    {
        public required string Name {  get; set; }
        public required short AgeID {  get; set; }
    }
}
