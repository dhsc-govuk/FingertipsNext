using System.Reflection.Metadata.Ecma335;
using System.Text.Json;
using System.Text.RegularExpressions;
using LINQtoCSV;

namespace DataCreator
{
    public class DataFileManager
    {
        private const string OutFilePath = @"..\..\..\data\out\";
        private const string InFilePath = @"..\..\..\data\in\";

        public static void WriteJsonData(string dataType, object data) => File.WriteAllText($"{OutFilePath}{dataType}.json", JsonSerializer.Serialize(data, 
            new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));

        public static void WriteHealthCsvData(string dataType, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, $"{OutFilePath}{dataType}.csv", new CsvFileDescription());

        public static void WriteAgeCsvData(string dataType, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{dataType}.csv", new CsvFileDescription());

        public static int[] GetIndicatorIds()
        {
            var content = File.ReadAllText($"{InFilePath}indicatorids.txt");
            return content.Split("\n").Select(int.Parse).ToArray();
        }

        public static IEnumerable<HealthMeasureEntity> GetHealthDataForIndicator(int indicatorId)
        {
            var filePath = $"{InFilePath}{indicatorId}.csv";
            if (!File.Exists(filePath))
                return Enumerable.Empty<HealthMeasureEntity>();
            var lines = File.ReadAllLines(filePath);
            var allData= new List<HealthMeasureEntity>();
            for(var count=1; count<lines.Length; count++)
            {
                var split=Regex.Split(lines[count], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                try
                {
                    var indicatorData = new HealthMeasureEntity
                    {
                        IndicatorId = indicatorId,
                        AreaCode = split[4].Trim(),
                        Age = split[8].Trim(),
                        Sex = split[7].Trim(),
                        Count = GetDoubleValue(split[17]),
                        Value = GetDoubleValue(split[12]),
                        LowerCI = GetDoubleValue(split[13]),
                        UpperCI = GetDoubleValue(split[14]),
                        Denominator = GetDoubleValue(split[18]),
                        Trend = split[20].Trim(),
                        Year = int.Parse(split[23].Trim().Substring(0,4))
                    };
                    allData.Add(indicatorData);
                }
                catch (Exception ex)
                {
                    if(ex.Message!= "Index was outside the bounds of the array.")
                    {
                        var b = 1;
                    }
                    
                }
                
            }
            return allData;
        }

        private static double? GetDoubleValue(string raw) => double.TryParse(raw.Trim(), out var value) ? value : null;
    }
}
