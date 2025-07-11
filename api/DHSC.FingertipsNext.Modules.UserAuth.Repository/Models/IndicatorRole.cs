using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

namespace DHSC.FingertipsNext.Modules.UserAuth.Repository.Models
{
    [Table("IndicatorRole", Schema = "User")]
    public class IndicatorRole
    {
        [Key]
        public int Id { get; set; }

        public Guid RoleId { get; init; }

        [ForeignKey(nameof(Indicator))]
        public short IndicatorKey { get; init; }

        public required IndicatorDimensionModel Indicator { get; set; }
    }
}
