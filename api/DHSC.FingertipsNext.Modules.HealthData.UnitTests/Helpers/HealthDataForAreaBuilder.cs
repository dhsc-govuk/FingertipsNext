using DHSC.FingertipsNext.Modules.HealthData.Schemas;
using System;
using System.Collections.Generic;
using System.IO.Pipelines;

namespace DHSC.FingertipsNext.Modules.HealthData.Tests.Helpers;

internal static class HealthDataForAreaBuilder
{
    public static HealthDataForArea WithSexSegments(string areaCode, double spread, int[] persons, int[]? male, int[]? female)
    {
        var sexes = new[] { "Male", "Female", "Persons" };
        var indicatorSegments = new List<IndicatorSegment>();

        foreach (var sexValue in sexes)
        {
            var sex = new Sex { Value = sexValue, IsAggregate = sexValue == "Persons" };
            var age = new Age { Value = "All ages", IsAggregate = true };
            var healthDataPoints = new List<HealthDataPoint>();
            var vals = sexValue switch
            {
                "Male" => male ?? persons,
                "Female" => female ?? persons,
                _ => persons
            };

            for (int i = 0; i < vals.Length; i++)
            {
                int year = 2020 + i;
                double value = vals[i];
                healthDataPoints.Add(new HealthDataPoint
                {
                    DatePeriod = new DatePeriod
                    {
                        From = new DateOnly(year, 1, 1),
                        To = new DateOnly(year, 12, 31),
                        PeriodType = DatePeriodType.Calendar
                    },
                    Count = value,
                    Value = value,
                    LowerConfidenceInterval = value - spread,
                    UpperConfidenceInterval = value + spread,
                    AgeBand = new Age { Value = "0-4", IsAggregate = true },
                    Deprivation = new Deprivation
                    {
                        Value = "Most deprived",
                        Type = "Decile",
                        Sequence = 1,
                        IsAggregate = true
                    },
                    Sex = sex,
                    ReportingPeriod = ReportingPeriod.Yearly,
                    Trend = "No change",
                    IsAggregate = sexValue == "Persons"
                });
            }

            indicatorSegments.Add(new IndicatorSegment
            {
                Age = age,
                Sex = sex,
                ReportingPeriod = ReportingPeriod.Yearly,
                IsAggregate = sexValue == "Persons",
                HealthData = healthDataPoints
            });
        }

        return new HealthDataForArea
        {
            AreaCode = areaCode,
            AreaName = "Mock Area",
            IndicatorSegments = indicatorSegments,
            HealthData = new List<HealthDataPoint>()
        };
    }
}