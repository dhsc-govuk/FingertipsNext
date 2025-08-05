using System.ComponentModel.DataAnnotations;

namespace TrendAnalysisApp.Repository.Models;

[Serializable]
public class DateDimensionModel
{
    [Key]
    public int DateKey { get; set; }
    public required DateTime Date { get; set; }
}
