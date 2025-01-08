using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas
{
    [Serializable]
    public class AreaDimension
    {
        public required int AreaKey { get; set; }
        [MaxLength(20)] public required string Code { get; set; }
        [MaxLength(255)] public required string Name { get; set; }
        public required DateTime StartDate { get; set; }
        public required DateTime EndDate { get; set; }
    }
}