using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models
{
    [Serializable]
    public class PeriodDimensionModel
    {
        [Key]
        public byte PeriodKey { get; set; }

        [MaxLength(50)]
        public required string Period { get; set; }
    }
}
