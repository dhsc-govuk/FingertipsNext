namespace DataCreator;

public class HealthMeasureDateCalculator
{
    
    /// <summary>
    /// use the healthMeasure.TimePeriodSortable, healthMeasure.(Reporting)Period and indicator.PeriodType
    /// to determine the healthMeasure.fromDate and healthMeasure.toDate 
    /// </summary>
    /// <param name="indicators"></param>
    /// <param name="healthMeasures"></param>
    public void CreateHealthMeasurePeriodDates(
            List<SimpleIndicator> indicators,
            List<HealthMeasureEntity> healthMeasures
            )
        {
            var indicatorsPeriodsMap = indicators.ToDictionary(
                i => i.IndicatorID,
                i => i.PeriodType);
            var indicatorsYearTypesMap = indicators.ToDictionary(
                i => i.IndicatorID,
                i => i.YearType);
            
            foreach (var healthMeasure in healthMeasures)
            {
                var indicatorPeriodType = indicatorsPeriodsMap[healthMeasure.IndicatorId];
                var indicatorYearType = indicatorsYearTypesMap[healthMeasure.IndicatorId];

                var startYear = int.Parse(healthMeasure.TimePeriodSortable.Trim()[..4]);
                var (yearIncrement, monthIncrement) = GetDateIncrement(healthMeasure.Period);
                
                
                switch (indicatorPeriodType)
                {
                    case "Calendar":
                        SetDates(healthMeasure,
                            new DateOnly(startYear, 1, 1).ToShortDateString(),
                            new DateOnly(startYear + yearIncrement, 12, 31).ToShortDateString());
                        break;
                    case "Financial":
                    case "Financial multi-year":
                        SetDates(healthMeasure,
                            new DateOnly(startYear, 4, 6).ToShortDateString(),
                            new DateOnly(startYear  + yearIncrement + 1, 4, 5).ToShortDateString());
                        break;
                    case "Financial year end point":
                        SetDates(healthMeasure, 
                            new DateOnly(startYear, 3, 31).ToShortDateString(), 
                            new DateOnly(startYear, 3, 31).ToShortDateString());
                        break;
                    case "Academic":
                        SetDates(healthMeasure, 
                            new DateOnly(startYear, 9, 1).ToShortDateString(),
                            new DateOnly(startYear  + yearIncrement+ 1, 7, 31).ToShortDateString());
                        break;
                    case "Yearly":
                        if (indicatorYearType == "November-November")
                        {
                            SetDates(healthMeasure,
                                new DateOnly(startYear, 11, 1).ToShortDateString(),
                                new DateOnly(startYear + yearIncrement + 1, 10, 31).ToShortDateString());
                        }
                        else
                        {
                            SetDates(healthMeasure, 
                                new DateOnly(startYear, 1, 1).ToShortDateString(),
                                new DateOnly(startYear + yearIncrement, 12, 31).ToShortDateString());
                        }
                        break;
                    default:
                        throw new ArgumentOutOfRangeException(nameof(indicators), indicatorPeriodType, "unknown PeriodType");
                }
            }

        }

    private static void SetDates(HealthMeasureEntity healthMeasure, string fromDate, string toDate)
    {
        healthMeasure.FromDate = fromDate;
        healthMeasure.ToDate = toDate;
    }

    private static (int yearIncrement, int monthIncrement) GetDateIncrement(string healthMeasurePeriod) => healthMeasurePeriod switch
    {
        "monthly" => (yearIncrement: 0, monthIncrement: 1),
        "quarterly" => (yearIncrement: 0, monthIncrement: 3),
        "yearly" => (yearIncrement: 0, monthIncrement: 0),
        "2 yearly" => (yearIncrement: 1, monthIncrement: 0),
        "3 yearly" => (yearIncrement: 2, monthIncrement: 0),
        "5 yearly" => (yearIncrement: 4, monthIncrement: 0),
        _ => throw new ArgumentOutOfRangeException(nameof(healthMeasurePeriod), healthMeasurePeriod,
            "unknown reportingPeriod")
    };
    
    
}