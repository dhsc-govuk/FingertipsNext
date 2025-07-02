using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using Shouldly;
using Xunit;

namespace DataCreator.Tests;

[TestFixture]
[TestOf(typeof(DataManager))]
public class DataManagerTests
{
    private readonly HealthMeasureDateCalculator _healthMeasureDateCalculator =  new();
    
    // TODO: cover reportingPeriods:
    // monthly "1m" - 93415
    // quarterly "3m" - 91040
    // yearly "1y" - 108
    // 2 yearly
    // 3 yearly "3y" - 92904
    // 5 yearly "5y" - 93283
    
    // TODO: Period Types
    // Calendar
    // Yearly
    // Financial
    // Financial year end point
    // Financial multi-year
    // Academic
    
    [Xunit.Theory]
    [InlineData("Calendar", "20090000", "01/01/2009","31/12/2009")]
    [InlineData("Yearly", "20090000", "01/01/2009","31/12/2009")]
    [InlineData("Financial","20080000", "06/04/2008","05/04/2009")]
    [InlineData("Financial multi-year","20080000", "06/04/2008","05/04/2009")]
    [InlineData("Financial year end point", "20090000", "31/03/2009","31/03/2009")]
    [InlineData("Academic","20080000", "01/09/2008","31/07/2009")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDateForMonthlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = "monthly";
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = indicatorPeriodType
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = timePeriodSortable,
                Period = "yearly",
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }
    
    
    [Xunit.Theory]
    [InlineData("Calendar", "20090000", "01/01/2009","31/12/2009")]
    [InlineData("Yearly", "20090000", "01/01/2009","31/12/2009")]
    [InlineData("Financial","20080000", "06/04/2008","05/04/2009")]
    [InlineData("Financial multi-year","20080000", "06/04/2008","05/04/2009")]
    [InlineData("Financial year end point", "20090000", "31/03/2009","31/03/2009")]
    [InlineData("Academic","20080000", "01/09/2008","31/07/2009")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDateForYearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
        )
    {
        const string reportingPeriod = "yearly";
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = indicatorPeriodType
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = timePeriodSortable,
                Period = "yearly",
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Xunit.Theory]
    [InlineData("Calendar", "20090000", "01/01/2009","31/12/2010")]
    [InlineData("Yearly", "20090000", "01/01/2009","31/12/2010")]
    [InlineData("Financial","20080000", "06/04/2008","05/04/2010")]
    [InlineData("Financial multi-year","20080000", "06/04/2008","05/04/2010")] // TODO: handle this!
    [InlineData("Academic","20080000", "01/09/2008","31/07/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDateFor2YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = "2 yearly";
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = indicatorPeriodType
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = timePeriodSortable,
                Period = reportingPeriod,
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }
    
    [Xunit.Theory]
    [InlineData("Calendar", "20090000", "01/01/2009","31/12/2011")]
    [InlineData("Yearly", "20090000", "01/01/2009","31/12/2011")]
    [InlineData("Financial","20080000", "06/04/2008","05/04/2011")]
    [InlineData("Academic","20080000", "01/09/2008","31/07/2011")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDateFor3YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = "3 yearly";
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = indicatorPeriodType
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = timePeriodSortable,
                Period = reportingPeriod,
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Xunit.Theory]
    [InlineData("Calendar", "20090000", "01/01/2009","31/12/2013")]
    [InlineData("Yearly", "20090000", "01/01/2009","31/12/2013")]
    [InlineData("Financial","20080000", "06/04/2008","05/04/2013")]
    [InlineData("Academic","20080000", "01/09/2008","31/07/2013")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDateFor5YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = "5 yearly";
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = indicatorPeriodType
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = timePeriodSortable,
                Period = reportingPeriod,
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }
    
    [Xunit.Theory]
    [InlineData("yearly", "01/11/2009", "31/10/2010")]
    [InlineData("2 yearly", "01/11/2009", "31/10/2011")]
    [InlineData("3 yearly", "01/11/2009", "31/10/2012")]
    [InlineData("5 yearly", "01/11/2009", "31/10/2014")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectYearlyDatesForNov_Nov(string period, string expectedFromDate, string expectedToDate)
    {
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = "Yearly",
                YearType = "November-November"
            }
        };
        var stubHealthMeasures = new List<HealthMeasureEntity>
        {
            new()
            {
                IndicatorId = 1,
                TimePeriodSortable = "20090000",
                Period = period,
            },
        };
        
        // Act
        _healthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;
        
        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }
}