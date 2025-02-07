using System.Text.Json;
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

        
    }
}
