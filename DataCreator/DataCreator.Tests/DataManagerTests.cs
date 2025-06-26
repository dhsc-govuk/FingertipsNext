using System.Collections.Generic;
using System.Linq;
using NUnit.Framework;
using Shouldly;

namespace DataCreator.Tests;

[TestFixture]
[TestOf(typeof(DataManager))]
public class DataManagerTests
{
    private List<SimpleIndicator> _stubIndicators;
    private List<HealthMeasureEntity> _stubHealthMeasures;

    [SetUp]
    public void SetUp()
    {
        _stubIndicators = new List<SimpleIndicator>
                {
                    new()
                    {
                        IndicatorID = 1,
                        PeriodType = "Calendar"
                    },
                    new()
                    {
                        IndicatorID = 2,
                        PeriodType = "Financial"
                    },
                    new()
                    {
                        IndicatorID = 3,
                        PeriodType = "November-November"
                    },
                };
        
        _stubHealthMeasures = new List<HealthMeasureEntity>
                {
                    new()
                    {
                        IndicatorId = 1,
                        TimePeriodSortable = "20090000"
                    },
                    new()
                    {
                        IndicatorId = 1,
                        TimePeriodSortable = "20100000"
                    },
                    new()
                    {
                        IndicatorId = 2,
                        TimePeriodSortable = "20090000"
                    },
                    new()
                    {
                        IndicatorId = 2,
                        TimePeriodSortable = "20100000"
                    },
                    new()
                    {
                        IndicatorId = 3,
                        TimePeriodSortable = "20090000"
                    },
                    new()
                    {
                        IndicatorId = 3,
                        TimePeriodSortable = "20100000"
                    },
                };
    }

    [Test]
    public void CreateHealthMeasurePeriodDates_ShouldCreateTheCorrectFromDateAndToDate()
    {
        // Arrange
        var expectedFromDates = new List<string>
        {
            "01/01/2009",
            "01/01/2010",
            "06/04/2009",
            "06/04/2010",
            "01/11/2009",
            "01/11/2010",
        };
        var expectedToDates = new List<string>
        {
            "31/12/2009",
            "31/12/2010",
            "05/04/2010",
            "05/04/2011",
            "31/10/2010",
            "31/10/2011",
        };
        
        // Act
        DataManager.CreateHealthMeasurePeriodDates(_stubIndicators, _stubHealthMeasures);
        // Extract
        var actualFromDates = _stubHealthMeasures.Select(hm => hm.FromDate).ToList ();
        var actualToDates = _stubHealthMeasures.Select(hm => hm.ToDate).ToList ();

        // Assert
        actualFromDates.ShouldBeEquivalentTo(expectedFromDates);
        actualToDates.ShouldBeEquivalentTo(expectedToDates);
    }
}