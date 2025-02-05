using System.Text.Json;
using LINQtoCSV;

namespace DataCreator
{
    public class DataFileWriter
    {
        private const string FilePath = @"..\..\..\data\";


        public static void WriteJsonData(string dataType, object data) => File.WriteAllText($"{FilePath}{dataType}.json", JsonSerializer.Serialize(data, 
            new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));

        public static void WriteHealthCsvData(string dataType, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, $"{FilePath}{dataType}.csv", new CsvFileDescription());
    }
}
