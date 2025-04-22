using System.Text.Json;
using LINQtoCSV;

namespace DataCreator
{
    public static class DataFileWriter
    {
        private static readonly string OutFilePath = Path.Combine("..","..","..", "data", "out");
        private static readonly string RepositoryRoot = Path.Combine("..", "..", "..", "..", "..");
        private static readonly string SearchSetupAssetsPath = Path.Combine(RepositoryRoot, "search-setup", "assets");

        private static readonly CsvFileDescription CsvFileDescription = new() {EnforceCsvColumnAttribute=true};
        private static readonly JsonSerializerOptions JsonSerializerOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public static void WriteIndicatorsJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, JsonSerializerOptions);
            File.WriteAllText(Path.Combine(RepositoryRoot, "trend-analysis", "TrendAnalysisApp", "SearchData", "assets", "indicators.json"), contents);
            File.WriteAllText(Path.Combine(SearchSetupAssetsPath, "indicators.json"), contents);
        }

        public static void WriteAreasJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, JsonSerializerOptions);
            File.WriteAllText(Path.Combine(SearchSetupAssetsPath, "areas.json"), contents);
        }

        public static void WriteHealthCsvData(string fileName, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, Path.Combine(OutFilePath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteSimpleIndicatorCsvData(string fileName, IEnumerable<SimpleIndicator> data) =>
             new CsvContext().Write(data, Path.Combine(OutFilePath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteSimpleAreaCsvData(string fileName, IEnumerable<SimpleAreaWithChildren> data) =>
             new CsvContext().Write(data, Path.Combine(OutFilePath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteAgeCsvData(string fileName, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, Path.Combine(OutFilePath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteCategoryCsvData(string fileName, IEnumerable<CategoryEntity> data) =>
            new CsvContext().Write(data, Path.Combine(OutFilePath, $"{fileName}.csv"), CsvFileDescription);
    }
}
