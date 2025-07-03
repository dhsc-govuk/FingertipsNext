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

        foreach (var healthMeasure in healthMeasures)
        {
            var indicatorPeriodType = indicatorsPeriodsMap[healthMeasure.IndicatorId];
            SetFromDate(indicatorPeriodType, healthMeasure);
            SetToDate(indicatorPeriodType, healthMeasure);
        }
    }

    private static void SetToDate(string indicatorPeriodType, HealthMeasureEntity healthMeasure)
    {
        Dictionary<string, (int yearIncrement, int monthIncrement)> incrementsMap = new()
        {
            {"monthly", (yearIncrement: 0, monthIncrement: 1)},
            {"quarterly" , (yearIncrement: 0, monthIncrement: 3)},
            {"yearly" , (yearIncrement: 1, monthIncrement: 0)},
            {"2 yearly" , (yearIncrement: 2, monthIncrement: 0)},
            {"3 yearly" , (yearIncrement: 3, monthIncrement: 0)},
            {"5 yearly" , (yearIncrement: 5, monthIncrement: 0)},
        };

        var toDate = DateTime.Parse(healthMeasure.FromDate);
        var (yearIncrement, monthIncrement) = incrementsMap[healthMeasure.Period];
        if (indicatorPeriodType != "Financial year end point")
        {
            toDate = toDate.AddYears(yearIncrement).AddMonths(monthIncrement).AddDays(-1);
        }

        healthMeasure.ToDate = toDate.ToShortDateString();
    }

    private static void SetFromDate(string indicatorPeriodType, HealthMeasureEntity healthMeasure)
    {
        Dictionary<string, (int startMonth, int startDay)> startMonthDayMap = new()
        {
            {"Calendar", (startMonth: 1, startDay: 1) },
            {"Yearly", (startMonth: 11, startDay: 1) },
            {"Financial", (startMonth: 4, startDay: 1) },
            {"Financial multi-year", (startMonth: 4, startDay: 1) },
            {"Financial year end point", (startMonth: 3, startDay: 31) },
            {"Academic", (startMonth: 9, startDay: 1) },
        };

        var baseStartYear = int.Parse(healthMeasure.TimePeriodSortable.Trim()[..4]);
        var (baseStartMonth, baseStartDay) = startMonthDayMap[indicatorPeriodType];
        var fromDate = new DateTime(baseStartYear, baseStartMonth, baseStartDay);

        switch (healthMeasure.Period)
        {
            case "quarterly":
                {
                    var quarterSegment = int.Parse(healthMeasure.TimePeriodSortable.Trim()[5].ToString());
                    fromDate = fromDate.AddMonths((quarterSegment - 1) * 3);
                    break;
                }
            case "monthly":
                {
                    var monthSegment = int.Parse(healthMeasure.TimePeriodSortable.Trim()[^2..]);
                    fromDate = fromDate.AddMonths(monthSegment - 1);
                    break;
                }
        }

        healthMeasure.FromDate = fromDate.ToShortDateString();
    }
}
