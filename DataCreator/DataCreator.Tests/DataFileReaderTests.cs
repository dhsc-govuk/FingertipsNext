using System.Collections.Generic;
using System.IO;
using DataCreator;
using NUnit.Framework;

namespace DataCreator.Tests;

[TestFixture]
[TestOf(typeof(DataFileReader))]
public class DataFileReaderTests
{
    [Test]
    public void GetHealthDataForIndicator_SkipsRowsWithCCGOrSTP()
    {
        // Arrange
        var indicatorId = 12345;
        var tempDir = Path.Join("..", "..", "..", "data", "in", "temp");
        Directory.CreateDirectory(tempDir);
        var filePath = Path.Join(tempDir, $"{indicatorId}.csv");
        var csvLines = new[]
        {
            "col0,col1,col2,col3,col4,col5,col6,col7,col8,col9,col10,col11,col12,col13,col14,col15,col16,col17,col18,col19,col20,col21,col22,col23,col24,col25,col26",
            // CCG row (should be skipped)
            "0,1,2,3,AREA1,5,CCG,M,10,catType,decile,11,12,13,14,15,16,17,18,19,20,21,22,2020-21,24,25,26",
            // STP row (should be skipped)
            "0,1,2,3,AREA2,5,STP,F,10,catType,decile,11,12,13,14,15,16,17,18,19,20,21,22,2020-21,24,25,26",
            // Valid row (should be included)
            "0,1,2,3,AREA3,5,OTHER,M,10,catType,decile,11,12,13,14,15,16,17,18,19,20,21,22,2020-21,24,25,26"
        };
        File.WriteAllLines(filePath, csvLines);
        var areasDict = new Dictionary<string, string>
        {
            { "AREA3", "Area 3" }
        };

        // Act
        var result = DataFileReader.GetHealthDataForIndicator(indicatorId, areasDict);

        // Assert
        Assert.That(result, Has.Exactly(1).Items);
        Assert.That(result[0].AreaCode, Is.EqualTo("AREA3"));

        // Cleanup
        File.Delete(filePath);
        Directory.Delete(tempDir, true);
    }
}

