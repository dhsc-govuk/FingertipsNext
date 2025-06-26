using System.IO.Compression;
using System.Text.Json;
using LINQtoCSV;

namespace DataCreator
{
    public static class DataFileWriter
    {
        private static readonly string OutFolderPath = Path.Join("..","..","..", "data", "out");
        private static readonly string RepositoryRoot = Path.Join("..", "..", "..", "..", "..");
        private static readonly string SearchSetupAssetsPath = Path.Join(RepositoryRoot, "search-setup", "assets");
        private static readonly string MockAiSearchAssetsPath = Path.Join(RepositoryRoot, "frontend", "fingertips-frontend","assets");

        private static readonly CsvFileDescription CsvFileDescription = new() {EnforceCsvColumnAttribute=true};
        private static readonly JsonSerializerOptions JsonSerializerOptions = new()
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        };

        public static void WriteIndicatorsJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, JsonSerializerOptions);
            File.WriteAllText(Path.Join(RepositoryRoot, "trend-analysis", "TrendAnalysisApp", "SearchData", "assets", "indicators.json"), contents);
            File.WriteAllText(Path.Join(SearchSetupAssetsPath, "indicators.json"), contents);
            File.WriteAllText(Path.Join(MockAiSearchAssetsPath, "mockIndicatorData.json"), contents);
        }

        public static void WriteAreasJsonData(object data)
        {
            var contents = JsonSerializer.Serialize(data, JsonSerializerOptions);
            File.WriteAllText(Path.Join(SearchSetupAssetsPath, "areas.json"), contents);
            File.WriteAllText(Path.Join(MockAiSearchAssetsPath, "mockAreaData.json"), contents);
        }

        public static void WriteHealthCsvData(string fileName, IEnumerable<HealthMeasureEntity> data)
        {
            var firstHalfCount = data.Count()/2;
            var firstHalf = data.Take(firstHalfCount);
            var secondHalf = data.Skip(firstHalfCount);
            
            new CsvContext().Write(firstHalf, Path.Join(OutFolderPath, $"{fileName}1.csv"), CsvFileDescription);
            new CsvContext().Write(secondHalf, Path.Join(OutFolderPath, $"{fileName}2.csv"), CsvFileDescription);
        } 

        public static void WriteSimpleIndicatorCsvData(string fileName, IEnumerable<SimpleIndicator> data) =>
             new CsvContext().Write(data, Path.Join(OutFolderPath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteSimpleAreaCsvData(string fileName, IEnumerable<SimpleAreaWithChildren> data) =>
             new CsvContext().Write(data, Path.Join(OutFolderPath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteAgeCsvData(string fileName, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, Path.Join(OutFolderPath, $"{fileName}.csv"), CsvFileDescription);

        public static void WriteCategoryCsvData(string fileName, IEnumerable<CategoryEntity> data) => 
            new CsvContext().Write(data, Path.Join(OutFolderPath, $"{fileName}.csv"), CsvFileDescription);
        
    }
}
