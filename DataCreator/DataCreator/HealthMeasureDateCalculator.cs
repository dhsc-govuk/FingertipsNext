using System.Globalization;

namespace DataCreator;
public static class HealthMeasureDateCalculator
{
    private static readonly Dictionary<string, (int yearIncrement, int monthIncrement)> _incrementsMap = new()
    {
        {PeriodConstants.Monthly, (yearIncrement: 0, monthIncrement: 1)},
        {PeriodConstants.Quarterly, (yearIncrement: 0, monthIncrement: 3)},
        {PeriodConstants.CumulativeQuarterly, (yearIncrement: 0, monthIncrement: 3)},
        {PeriodConstants.Yearly, (yearIncrement: 1, monthIncrement: 0)},
        {PeriodConstants.TwoYearly, (yearIncrement: 2, monthIncrement: 0)},
        {PeriodConstants.ThreeYearly, (yearIncrement: 3, monthIncrement: 0)},
        {PeriodConstants.FiveYearly, (yearIncrement: 5, monthIncrement: 0)},
    };

    private static readonly Dictionary<string, (int startMonth, int startDay)> _startMonthDayMap = new()
    {
        {PeriodTypeConstants.Calendar, (startMonth: 1, startDay: 1) },
        {PeriodTypeConstants.Yearly, (startMonth: 11, startDay: 1) },
        {PeriodTypeConstants.Financial, (startMonth: 4, startDay: 1) },
        {PeriodTypeConstants.FinancialMultiYear, (startMonth: 4, startDay: 1) },
        {PeriodTypeConstants.FinancialYearEndPoint, (startMonth: 3, startDay: 31) },
        {PeriodTypeConstants.Academic, (startMonth: 9, startDay: 1) },
    };

    /// <summary>
    /// use the healthMeasure.TimePeriodSortable, healthMeasure.(Reporting)Period and indicator.PeriodType
    /// to determine the healthMeasure.fromDate and healthMeasure.toDate 
    /// </summary>
    /// <param name="indicators"></param>
    /// <param name="healthMeasures"></param>
    public static void CreateHealthMeasurePeriodDates
    (
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
        var toDate = DateTime.Parse(healthMeasure.FromDate, new CultureInfo("en-GB"));

        if (healthMeasure.Period == PeriodConstants.CumulativeQuarterly)
        {
            var incrementMultiplier = int.Parse(healthMeasure.TimePeriodSortable.Trim().Substring(4, 2));
            toDate = toDate.AddMonths(incrementMultiplier * 3);
        }
        else
        {
            var (yearIncrement, monthIncrement) = _incrementsMap[healthMeasure.Period];
            toDate = indicatorPeriodType != "Financial year end point" ?
                toDate.AddYears(yearIncrement).AddMonths(monthIncrement)
                    .AddDays(-1) : toDate.AddYears(yearIncrement - 1);
        }


        healthMeasure.ToDate = toDate.ToShortDateString();
    }

    private static void SetFromDate(string indicatorPeriodType, HealthMeasureEntity healthMeasure)
    {
        var baseStartYear = int.Parse(healthMeasure.TimePeriodSortable.Trim()[..4]);
        var (baseStartMonth, baseStartDay) = _startMonthDayMap[indicatorPeriodType];
        var fromDate = new DateTime(baseStartYear, baseStartMonth, baseStartDay, 0, 0, 0, DateTimeKind.Utc);

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
