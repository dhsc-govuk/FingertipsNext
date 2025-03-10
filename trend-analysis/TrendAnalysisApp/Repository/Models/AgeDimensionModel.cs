using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

public class AgeDimensionModel
{
    [Key]
    public short AgeKey { get; set; }
    public short AgeID { get; set; }
    public bool HasValue { get; set; }
}
