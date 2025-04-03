using System.Text.Json;
using LINQtoCSV;

namespace DataCreator
{
    public static class DataFileWriter
    {
        private const string OutFilePath = @"..\..\..\data\out\";

        private static readonly CsvFileDescription csvFileDescription=new() {EnforceCsvColumnAttribute=true};

        public static void WriteJsonData(string dataType, object data)
        {
            var contents = JsonSerializer.Serialize(data,
                new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            File.WriteAllText($@"..\..\..\..\..\trend-analysis\TrendAnalysisApp\SearchData\assets\{dataType}.json", contents);
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
