﻿using System.ComponentModel.DataAnnotations;

namespace DHSC.FingertipsNext.Modules.HealthData.Repository.Models;

[Serializable]
public class SexDimensionModel
{
    [Key]
    public required byte SexKey { get; set; }
    [MaxLength(50)]
    public required string Name { get; set; }
    public required bool HasValue { get; set; }
    public required byte SexId { get; set; }
}
