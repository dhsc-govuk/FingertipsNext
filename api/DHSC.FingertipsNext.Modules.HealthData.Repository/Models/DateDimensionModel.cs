using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class DateDimensionModel
{
    [Key]
    public int DateKey { get; set; }

    public required DateTime Date { get; set; }

    public byte Day { get; set; }

    [MaxLength(2)]
    public string? DaySuffix { get; set; }

    public byte Weekday { get; set; }

    [MaxLength(10)]
    public string? WeekDayName { get; set; }

    public short DayOfYear { get; set; }

    public byte WeekOfMonth { get; set; }

    public byte WeekOfYear { get; set; }

    public byte Month { get; set; }

    [MaxLength(10)]
    public string? MonthName { get; set; }

    [MaxLength(3)]
    public string? MonthNameShort { get; set; }

    public byte Quarter { get; set; }

    [MaxLength(6)]
    public string? QuarterName { get; set; }

    public int Year { get; set; }

    public bool IsWeekend { get; set; }
}
