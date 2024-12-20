using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.Core.Schema
{
    [Serializable]
    public class IndicatorDimension
    {
        [Key]
        public required int IndicatorKey { get; set; }
        [MaxLength(255)]
        public required string Name { get; set; }
        public required int IndicatorId { get; set; }
        public required DateTime StartDate {  get; set; }
        public required DateTime EndDate { get; set; }
    }
}
