using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Repository.Dimensions.Models
{
    [Serializable]
    public class AreaDimension
    {
        [Key]
        public required int AreaKey { get; set; }
        [MaxLength(20)]
        public required string Code {  get; set; }
        [MaxLength(255)]
        public required string Name { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }
}
