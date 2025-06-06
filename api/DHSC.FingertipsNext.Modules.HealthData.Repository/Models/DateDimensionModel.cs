using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class DateDimensionModel
{
    [Key]
    public int DateKey { get; set; }

    [Required]
    public DateTime Date { get; set; }

    [Required]
    public byte Day { get; set; }

    [Required, MaxLength(2)]
    public string DaySuffix { get; set; } = string.Empty;

    [Required]
    public byte Weekday { get; set; }

    [Required, MaxLength(10)]
    public string WeekDayName { get; set; } = string.Empty;

    [Required]
    public short DayOfYear { get; set; }

    [Required]
    public byte WeekOfMonth { get; set; }

    [Required]
    public byte WeekOfYear { get; set; }

    [Required]
    public byte Month { get; set; }

    [Required, MaxLength(10)]
    public string MonthName { get; set; } = string.Empty;

    [Required, MaxLength(3)]
    public string MonthNameShort { get; set; } = string.Empty;

    [Required]
    public byte Quarter { get; set; }

    [Required, MaxLength(6)]
    public string QuarterName { get; set; } = string.Empty;

    [Required]
    public int Year { get; set; }

    [Required]
    public bool IsWeekend { get; set; }
}
