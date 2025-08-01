using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using Shouldly;

namespace DataCreator.Tests;

[TestFixture]
[TestOf(typeof(DataManager))]
public class DataManagerTests
{
    [Theory]
    [TestCase(PeriodTypeConstants.Calendar, "20090000", "01/01/2009", "31/12/2009")]
    [TestCase(PeriodTypeConstants.Yearly, "20090000", "01/11/2009", "31/10/2010")]
    [TestCase(PeriodTypeConstants.Financial, "20090000", "01/04/2009", "31/03/2010")]
    [TestCase(PeriodTypeConstants.FinancialMultiYear, "20090000", "01/04/2009", "31/03/2010")]
    [TestCase(PeriodTypeConstants.FinancialYearEndPoint, "20090000", "31/03/2009", "31/03/2009")]
    [TestCase(PeriodTypeConstants.Academic, "20090000", "01/09/2009", "31/08/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDate_ForYearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
        )
    {
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
                Period = PeriodConstants.Yearly,
            },
        };

        // Act
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase(PeriodTypeConstants.Calendar, "20090000", "01/01/2009", "31/12/2010")]
    [TestCase(PeriodTypeConstants.Yearly, "20090000", "01/11/2009", "31/10/2011")]
    [TestCase(PeriodTypeConstants.Financial, "20090000", "01/04/2009", "31/03/2011")]
    [TestCase(PeriodTypeConstants.FinancialMultiYear, "20090000", "01/04/2009", "31/03/2011")]
    [TestCase(PeriodTypeConstants.FinancialYearEndPoint, "20090000", "31/03/2009", "31/03/2010")]
    [TestCase(PeriodTypeConstants.Academic, "20090000", "01/09/2009", "31/08/2011")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDate_For2YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.TwoYearly;
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase(PeriodTypeConstants.Calendar, "20090000", "01/01/2009", "31/12/2011")]
    [TestCase(PeriodTypeConstants.Yearly, "20090000", "01/11/2009", "31/10/2012")]
    [TestCase(PeriodTypeConstants.Financial, "20090000", "01/04/2009", "31/03/2012")]
    [TestCase(PeriodTypeConstants.FinancialMultiYear, "20090000", "01/04/2009", "31/03/2012")]
    [TestCase(PeriodTypeConstants.FinancialYearEndPoint, "20090000", "31/03/2009", "31/03/2011")]
    [TestCase(PeriodTypeConstants.Academic, "20090000", "01/09/2009", "31/08/2012")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDate_For3YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.ThreeYearly;
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase(PeriodTypeConstants.Calendar, "20090000", "01/01/2009", "31/12/2013")]
    [TestCase(PeriodTypeConstants.Yearly, "20090000", "01/11/2009", "31/10/2014")]
    [TestCase(PeriodTypeConstants.Financial, "20090000", "01/04/2009", "31/03/2014")]
    [TestCase(PeriodTypeConstants.FinancialMultiYear, "20090000", "01/04/2009", "31/03/2014")]
    [TestCase(PeriodTypeConstants.FinancialYearEndPoint, "20090000", "31/03/2009", "31/03/2013")]
    [TestCase(PeriodTypeConstants.Academic, "20080000", "01/09/2008", "31/08/2013")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDate_For5YearlyPeriod(
        string indicatorPeriodType,
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.FiveYearly;
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090100", "01/01/2009", "31/03/2009")]
    [TestCase("20090200", "01/04/2009", "30/06/2009")]
    [TestCase("20090300", "01/07/2009", "30/09/2009")]
    [TestCase("20090400", "01/10/2009", "31/12/2009")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectDates_ForCalendarQuarterly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Quarterly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.Calendar
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090100", "01/04/2009", "30/06/2009")]
    [TestCase("20090200", "01/07/2009", "30/09/2009")]
    [TestCase("20090300", "01/10/2009", "31/12/2009")]
    [TestCase("20090400", "01/01/2010", "31/03/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDate_ForFinancialQuarterly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Quarterly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.Financial
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090100", "01/04/2009", "30/06/2009")]
    [TestCase("20090200", "01/07/2009", "30/09/2009")]
    [TestCase("20090300", "01/10/2009", "31/12/2009")]
    [TestCase("20090400", "01/01/2010", "31/03/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDate_ForFinancialMultiYearQuarterly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Quarterly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.FinancialMultiYear
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090001", "01/01/2009", "31/01/2009")]
    [TestCase("20090002", "01/02/2009", "28/02/2009")]
    [TestCase("20090003", "01/03/2009", "31/03/2009")]
    [TestCase("20090004", "01/04/2009", "30/04/2009")]
    [TestCase("20090005", "01/05/2009", "31/05/2009")]
    [TestCase("20090006", "01/06/2009", "30/06/2009")]
    [TestCase("20090007", "01/07/2009", "31/07/2009")]
    [TestCase("20090008", "01/08/2009", "31/08/2009")]
    [TestCase("20090009", "01/09/2009", "30/09/2009")]
    [TestCase("20090010", "01/10/2009", "31/10/2009")]
    [TestCase("20090011", "01/11/2009", "30/11/2009")]
    [TestCase("20090012", "01/12/2009", "31/12/2009")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDate_ForCalendarMonthly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Monthly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.Calendar
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090001", "01/04/2009", "30/04/2009")]
    [TestCase("20090002", "01/05/2009", "31/05/2009")]
    [TestCase("20090003", "01/06/2009", "30/06/2009")]
    [TestCase("20090004", "01/07/2009", "31/07/2009")]
    [TestCase("20090005", "01/08/2009", "31/08/2009")]
    [TestCase("20090006", "01/09/2009", "30/09/2009")]
    [TestCase("20090007", "01/10/2009", "31/10/2009")]
    [TestCase("20090008", "01/11/2009", "30/11/2009")]
    [TestCase("20090009", "01/12/2009", "31/12/2009")]
    [TestCase("20090010", "01/01/2010", "31/01/2010")]
    [TestCase("20090011", "01/02/2010", "28/02/2010")]
    [TestCase("20090012", "01/03/2010", "31/03/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDate_ForFinancialMonthly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Monthly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.Financial
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }

    [Theory]
    [TestCase("20090001", "01/09/2009", "30/09/2009")]
    [TestCase("20090002", "01/10/2009", "31/10/2009")]
    [TestCase("20090003", "01/11/2009", "30/11/2009")]
    [TestCase("20090004", "01/12/2009", "31/12/2009")]
    [TestCase("20090005", "01/01/2010", "31/01/2010")]
    [TestCase("20090012", "01/08/2010", "31/08/2010")]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDate_ForAcademicMonthly(
        string timePeriodSortable,
        string expectedFromDate,
        string expectedToDate
    )
    {
        const string reportingPeriod = PeriodConstants.Monthly;
        var stubIndicators = new List<SimpleIndicator>{
            new()
            {
                IndicatorID = 1,
                PeriodType = PeriodTypeConstants.Academic
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
        HealthMeasureDateCalculator.CreateHealthMeasurePeriodDates(stubIndicators, stubHealthMeasures);
        // Extract
        var actualFromDates = stubHealthMeasures.First().FromDate;
        var actualToDates = stubHealthMeasures.First().ToDate;

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDate);
        actualToDates.ShouldBeEquivalentTo(expectedToDate);
    }
}
