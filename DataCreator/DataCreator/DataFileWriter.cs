using System.Text.Json;
using LINQtoCSV;

namespace DataCreator
{
    public static class DataFileWriter
    {
        private const string OutFilePath = @"..\..\..\data\out\";

        private static readonly CsvFileDescription csvFileDescription=new() {EnforceCsvColumnAttribute=true};
        private static readonly JsonSerializerOptions jsonSerializerOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public static void WriteIndicatorsJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, jsonSerializerOptions);
            File.WriteAllText($@"..\..\..\..\..\trend-analysis\TrendAnalysisApp\SearchData\assets\indicators.json", contents);
            File.WriteAllText($@"..\..\..\..\..\search-setup\assets\indicators.json", contents);
        }

        public static void WriteAreasJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, jsonSerializerOptions);
            File.WriteAllText($@"..\..\..\..\..\search-setup\assets\areas.json", contents);
        }

        public static void WriteHealthCsvData(string fileName, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteSimpleIndicatorCsvData(string fileName, IEnumerable<SimpleIndicator> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteSimpleAreaCsvData(string fileName, IEnumerable<SimpleAreaWithChildren> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteAgeCsvData(string fileName, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteCategoryCsvData(string fileName, IEnumerable<CategoryEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);
    }
}
