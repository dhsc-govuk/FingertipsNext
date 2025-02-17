using System.IO.Compression;
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

        public static void WriteHealthCsvData(string fileName, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", new CsvFileDescription());

        public static void WriteSimpleIndicatorCsvData(string fileName, IEnumerable<SimpleIndicator> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", new CsvFileDescription());

        public static void WriteSimpleAreaCsvData(string fileName, IEnumerable<SimpleAreaWithRelations> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", new CsvFileDescription());

        public static void WriteAgeCsvData(string fileName, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", new CsvFileDescription());

        public static int[] GetIndicatorIds() =>
            File.ReadAllText(@$"{InFilePath}\temp\indicatorids.txt").Split("\n").Select(int.Parse).ToArray();

        public static void WriteCategoryCsvData(string fileName, IEnumerable<CategoryEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", new CsvFileDescription());

        public static IEnumerable<HealthMeasureEntity> GetHealthDataForIndicator(int indicatorId)
        {
            //this is a csv file that was downloaded from the Fingertips API
            var filePath = @$"{InFilePath}\temp\{indicatorId}.csv";
            if (!File.Exists(filePath))
                return Enumerable.Empty<HealthMeasureEntity>();
            var lines = File.ReadAllLines(filePath);
            var allData= new List<HealthMeasureEntity>();
            for(var count=1; count<lines.Length; count++)
            {
                //some values have commas in them so we can't do a simple split on comma values so use this regex to allow for that
                var split=Regex.Split(lines[count], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                try
                {
                    var indicatorData = new HealthMeasureEntity
                    {
                        IndicatorId = indicatorId,
                        AreaCode = split[4].Trim().CleanAreaCode(),
                        Age = split[8].Trim(),
                        Sex = split[7].Trim(),
                        Count = GetDoubleValue(split[17]),
                        Value = GetDoubleValue(split[12]),
                        LowerCI = GetDoubleValue(split[13]),
                        UpperCI = GetDoubleValue(split[14]),
                        Denominator = GetDoubleValue(split[18]),
                        Trend = split[20].Trim(),
                        Year = int.Parse(split[23].Trim().Substring(0,4)),
                        Category = split[10].Trim(),
                        CategoryType = split[9].Trim()
                    };
                    allData.Add(indicatorData);
                }
                catch
                {
                    
                }
            }

            return allData;
        }

        public static IEnumerable<IndicatorLastUpdatedEntity> GetLastUpdatedDataForIndicators()
        {
            //this is a csv file that was downloaded from the Fingertips API
            var filePath = @$"{InFilePath}\temp\lastupdated.csv";
            
            var lines = File.ReadAllLines(filePath);
            var allData = new List<IndicatorLastUpdatedEntity>();
            for (var count = 1; count < lines.Length; count++)
            {
                var split = lines[count].Split(',');
                allData.Add(new IndicatorLastUpdatedEntity 
                {
                    IndicatorId = int.Parse(split[0].Trim('\"')),
                    LastUpdatedDate= split[1].Trim('\"')
                });
            }

             return allData;
        }

        public static void UnzipSourceFiles() => ZipFile.ExtractToDirectory(@$"{InFilePath}\in.zip", @$"{InFilePath}\temp");

        public static void DeleteTempFiles() => Directory.Delete(@$"{InFilePath}\temp", true);

        public static void CopyFilesToTargetLocations()
        {
            foreach (var file in Directory.GetFiles(OutFilePath))
            {
                File.Copy(file, Path.Combine(@"..\..\..\..\..\search-setup\assets", Path.GetFileName(file)), true);
                //File.Copy(file, Path.Combine(@"..\..\..\..\..\frontend\fingertips-frontend\assets", Path.GetFileName(file)),true);
            }
        }

        private static double? GetDoubleValue(string raw) => double.TryParse(raw.Trim(), out var value) ? value : null;
    }
}
