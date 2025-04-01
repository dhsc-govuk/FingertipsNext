using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

public class QuartileDataModel
{
    [Key]
    public required int IndicatorId { get; set; }
    public required string Polarity { get; set; }
    public required short Year { get; set; }
    public required double Q0Value { get; set; }
    public required double Q1Value { get; set; }
    public required double Q2Value { get; set; }
    public required double Q3Value { get; set; }
    public required double Q4Value { get; set; }
    public required double AreaValue { get; set; }
    public required double? AncestorValue { get; set; }
    public required double? EnglandValue { get; set; }
}
