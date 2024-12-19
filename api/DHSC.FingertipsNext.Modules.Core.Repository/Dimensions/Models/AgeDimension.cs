using System.ComponentModel.DataAnnotations;
using Microsoft.EntityFrameworkCore;

namespace DHSC.FingertipsNext.Modules.Core.Repository.Dimensions.Models
{
    [Serializable]
    public class AgeDimension
    {
        [Key]
        public required short AgeKey {  get; set; }
        [MaxLength(50)]
        public required string Name {  get; set; }
        public required short AgeID {  get; set; }
    }
}
