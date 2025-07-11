﻿using System.Text.Json.Serialization;

namespace DHSC.FingertipsNext.Modules.HealthData.Schemas;

/// <summary>
///     Associates a list of health data points with the relevant
///     geographical area (represented by its unique code).
/// </summary>
public class IndicatorSegment
{
    /// <summary>
    ///     Sex which the data are for.
    /// </summary>
    [JsonPropertyName("sex")]
    public required Sex Sex { get; init; }

    /// <summary>
    ///     Is the segment the aggregate for the indicator
    /// </summary>
    [JsonPropertyName("isAggregate")]
    public bool IsAggregate { get; init; }

    /// <summary>
    ///     The health data points for the area and indicator
    /// </summary>
    [JsonPropertyName("healthData")]
    public IEnumerable<HealthDataPoint> HealthData { get; init; } = [];
}
