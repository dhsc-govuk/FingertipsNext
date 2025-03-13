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
        private static readonly CsvFileDescription csvFileDescription=new CsvFileDescription (); 

        public static void WriteJsonData(string dataType, object data) => File.WriteAllText($"{OutFilePath}{dataType}.json", JsonSerializer.Serialize(data, 
            new JsonSerializerOptions
        {
            PropertyNamingPolicy = JsonNamingPolicy.CamelCase
        }));

        public static void WriteHealthCsvData(string fileName, IEnumerable<HealthMeasureEntity> data) => 
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteSimpleIndicatorCsvData(string fileName, IEnumerable<SimpleIndicator> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteSimpleAreaCsvData(string fileName, IEnumerable<SimpleAreaWithRelations> data) =>
             new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static void WriteAgeCsvData(string fileName, IEnumerable<AgeEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        public static List<SimpleIndicator> GetPocIndicators()
        {
            var lines=File.ReadAllLines(@$"{InFilePath}\temp\pocindicators.csv");
            var indicators=new List<SimpleIndicator>();   
            foreach (var line in lines)
            {
                var split=line.Split(',');
                indicators.Add(new SimpleIndicator
                {
                    IndicatorID= int.Parse(split[0]),
                    IndicatorName= split[1],
                    BenchmarkComparisonMethod= split[2],
                    Polarity =split[3]
                });
            }

            return indicators;
        }
            

        public static void WriteCategoryCsvData(string fileName, IEnumerable<CategoryEntity> data) =>
            new CsvContext().Write(data, $"{OutFilePath}{fileName}.csv", csvFileDescription);

        /// <summary>
        /// Get health data from csv files that have been downloaded from the fingertips API
        /// </summary>
        /// <param name="indicatorId"></param>
        /// <param name="yearFrom"></param>
        /// <param name="areasWeWant"></param>
        /// <returns></returns>
        public static List<HealthMeasureEntity> GetHealthDataForIndicator(int indicatorId, int yearFrom, List<string> areasWeWant)
        {
            const string ALL = "All";
            //this is a csv file that was downloaded from the Fingertips API
            var filePath = @$"{InFilePath}\temp\{indicatorId}.csv";
            if (!File.Exists(filePath))
                return Enumerable.Empty<HealthMeasureEntity>().ToList();

            var areasDict = areasWeWant.ToDictionary(a => a);
            var lines = File.ReadAllLines(filePath);
            var allData= new List<HealthMeasureEntity>();
            for(var count=1; count<lines.Length; count++) //start at 1 to avoid first line which is column names
            {
                //some values have commas in them so we can't do a simple split on comma values so use this regex to allow for that
                var split=Regex.Split(lines[count], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                if (split.Length != 27)
                    continue; //avoid bad data
                var areaCode = split[4].Trim().CleanAreaCode();
                if(!areasDict.TryGetValue(areaCode, out var area)) 
                    continue; //if the row is not for an area we are interested in then ignore it
                var year  = int.Parse(split[23].Trim().Substring(0, 4));
                if(year < yearFrom)
                    continue; //if the row is not for a year we care about ignore it
                var categoryType = split[9].Trim().Trim('\"');
                if (!(categoryType == string.Empty || categoryType.Contains("deciles", StringComparison.CurrentCultureIgnoreCase)))
                    continue;  //we only care about data that has a category type of decile or no category type

                var category = split[10].Trim().Trim('\"');
                if (categoryType == string.Empty)
                {
                    categoryType = ALL;
                    category = ALL;
                }

                var indicatorData = new HealthMeasureEntity
                {
                    IndicatorId = indicatorId,
                    AreaCode = areaCode,
                    Age = split[8].Trim(),
                    Sex = split[7].Trim(),
                    Count = GetDoubleValue(split[17]),
                    Value = GetDoubleValue(split[12]),
                    Lower95CI = GetDoubleValue(split[13]),
                    Upper95CI = GetDoubleValue(split[14]),
                    Lower98CI = GetDoubleValue(split[15]),
                    Upper98CI = GetDoubleValue(split[16]),
                    Denominator = GetDoubleValue(split[18]),
                    Year = year,
                    Category = category.Trim(),
                    CategoryType = categoryType.Replace(',','-').Trim()
                };
                allData.Add(indicatorData);
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
            }
        }

        private static double? GetDoubleValue(string raw) => double.TryParse(raw.Trim(), out var value) ? value : null;
    }
}
