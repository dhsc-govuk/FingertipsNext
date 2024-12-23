using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Schema
{
    [Serializable]
    public class AgeDimension
    {
        [Key]
        public required int AgeKey {  get; set; }
        [MaxLength(50)]
        public required string Name {  get; set; }
        public required int AgeId {  get; set; }
    }
}
