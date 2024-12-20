using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Schema
{
    [Serializable]
    public class SexDimension
    {
        [Key]
        public required int SexKey { get; set; }
        [MaxLength(50)]
        public required string Name { get; set; }
        public required bool IsFemale { get; set; }
        public required bool HasValue { get; set; }
        public required int SexId { get; set; }
    }
}
