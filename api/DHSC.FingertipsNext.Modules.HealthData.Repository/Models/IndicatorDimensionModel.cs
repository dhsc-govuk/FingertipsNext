﻿using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class IndicatorDimensionModel
{
    [Key]
    public required short IndicatorKey { get; set; }
    [MaxLength(255)]
    public required string Name { get; set; }
    public required int IndicatorId { get; set; }
    public required DateTime StartDate { get; set; }
    public required DateTime EndDate { get; set; }
}
