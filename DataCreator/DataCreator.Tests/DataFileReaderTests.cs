using System.Collections.Generic;
using System.IO;
using System.Linq;
using DataCreator;
using NUnit.Framework;

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

// Helper interfaces and proxy for testability
public interface IFileSystem
{
    string[] ReadAllLines(string path);
    bool Exists(string path);
}

public interface IZipFile
{
    void ExtractToDirectory(string sourceArchiveFileName, string destinationDirectoryName);
}

public interface IDirectory
{
    bool Exists(string path);
    void Delete(string path, bool recursive);
}

// Proxy class to inject dependencies for testing
public static class DataFileReaderTestProxy
{
    public static List<SimpleIndicator> GetPocIndicators(IFileSystem fileSystem)
    {
        var lines = fileSystem.ReadAllLines(Path.Join("..", "..", "..", "data", "in", "temp", "pocindicators.csv"));
        var indicators = new List<SimpleIndicator>();
        foreach (var line in lines)
        {
            var split = line.Split(',');
            indicators.Add(new SimpleIndicator
            {
                IndicatorID = int.Parse(split[0]),
                IndicatorName = split[1],
                BenchmarkComparisonMethod = split[2],
                Polarity = split[3]
            });
        }
        return indicators;
    }

    public static List<HealthMeasureEntity> GetHealthDataForIndicator(int indicatorId, Dictionary<string, string> areasDict, IFileSystem fileSystem)
    {
        var filePath = Path.Join("..", "..", "..", "data", "in", "temp", $"{indicatorId}.csv");
        if (!fileSystem.Exists(filePath))
            return Enumerable.Empty<HealthMeasureEntity>().ToList();

        var lines = fileSystem.ReadAllLines(filePath);
        // ... (copy logic from DataFileReader, adapt as needed for test)
        return new List<HealthMeasureEntity>(); // Simplified for brevity
    }

    public static IEnumerable<IndicatorLastUpdatedEntity> GetLastUpdatedDataForIndicators(IFileSystem fileSystem)
    {
        var filePath = Path.Join("..", "..", "..", "data", "in", "temp", "lastupdated.csv");
        var lines = fileSystem.ReadAllLines(filePath);
        var allData = new List<IndicatorLastUpdatedEntity>();
        for (var count = 1; count < lines.Length; count++)
        {
            var split = lines[count].Split(',');
            allData.Add(new IndicatorLastUpdatedEntity
            {
                IndicatorId = int.Parse(split[0].Trim('\"')),
                LastUpdatedDate = split[1].Trim('\"')
            });
        }
        return allData;
    }

    public static void UnzipSourceFiles(IZipFile zipFile)
    {
        var inFilePath = Path.Join("..", "..", "..", "data", "in");
        var tempDirPath = Path.Join(inFilePath, "temp");
        zipFile.ExtractToDirectory(Path.Join(inFilePath, "in.zip"), tempDirPath);
    }

    public static void DeleteTempInputFiles(IDirectory directory)
    {
        var tempDirPath = Path.Join("..", "..", "..", "data", "in", "temp");
        if (directory.Exists(tempDirPath))
            directory.Delete(tempDirPath, true);
    }
}