using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas
{
    [Serializable]
    public class AgeDimensionDto
    {
        [Key]
        public required int AgeKey { get; set; }
        [MaxLength(50)]
        public required string Name { get; set; }
        public required int AgeId { get; set; }
    }
}
