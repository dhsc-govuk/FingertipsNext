using System.IO.Compression;
using System.Text.RegularExpressions;

namespace DataCreator
{
    public static class DataFileReader
    {
        private const string Persons = "Persons";
        private const string InFilePath = @"..\..\..\data\in\";

        public static List<SimpleIndicator> GetPocIndicators()
        {
            var lines = File.ReadAllLines(@$"{InFilePath}\temp\pocindicators.csv");
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

        /// <summary>
        /// Get health data from csv files that have been downloaded from the fingertips API
        /// </summary>
        /// <param name="indicatorId"></param>
        /// <param name="yearFrom"></param>
        /// <param name="areasWeWant"></param>
        /// <returns></returns>
        public static List<HealthMeasureEntity> GetHealthDataForIndicator(int indicatorId, Dictionary<string, string> areasDict)
        {

            //this is a csv file that was downloaded from the Fingertips API
            var filePath = @$"{InFilePath}\temp\{indicatorId}.csv";
            if (!File.Exists(filePath))
                return Enumerable.Empty<HealthMeasureEntity>().ToList();

            var lines = File.ReadAllLines(filePath);
            var allData = new List<HealthMeasureEntity>(1000);
            var loopLength = lines.Length;
            for (var count = 1; count < loopLength; count++) //start at 1 to avoid first line which is column names
            {
                //some values have commas in them so we can't do a simple split on comma values so use this regex to allow for that
                var split = Regex.Split(lines[count], "[,]{1}(?=(?:[^\"]*\"[^\"]*\")*(?![^\"]*\"))");
                if (split.Length != 27)
                    continue; //avoid bad data

                if (split[6].Equals("CCG", StringComparison.CurrentCultureIgnoreCase)) //CCGs and ICBs share the same area code so do this to avoid doubling up data
                    continue;
                var areaCode = split[4].Trim().CleanAreaCode();

                if (!areasDict.TryGetValue(areaCode, out var area))
                    continue; //if the row is not for an area we are interested in then ignore it

                var categoryType = split[9].Trim().Trim('\"');

                var category = split[10].Trim().Trim('\"');
                if (!(category == string.Empty || category.Contains("decile", StringComparison.CurrentCultureIgnoreCase)))
                    continue;  //we only care about data that has a category type of decile or no category type
                if (categoryType == string.Empty)
                {
                    categoryType = Persons;
                    category = Persons;
                }

                var age = split[8].Trim();

                //there is bad data for indicator 92033, we don't want 4-5 yrs
                if (indicatorId == 92033 && age == "4-5 yrs")
                    continue;
                var indicatorData = new HealthMeasureEntity
                {
                    IndicatorId = indicatorId,
                    AreaCode = areaCode,
                    Age = age,
                    Sex = split[7].Trim(),
                    Count = GetDoubleValue(split[17]),
                    Value = GetDoubleValue(split[12]),
                    Lower95CI = GetDoubleValue(split[13]),
                    Upper95CI = GetDoubleValue(split[14]),
                    Lower98CI = GetDoubleValue(split[15]),
                    Upper98CI = GetDoubleValue(split[16]),
                    Denominator = GetDoubleValue(split[18]),
                    Year = int.Parse(split[23].Trim().Substring(0, 4)),
                    Category = category.Trim(),
                    CategoryType = categoryType.Trim()
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
                    LastUpdatedDate = split[1].Trim('\"')
                });
            }

            return allData;
        }

        public static void UnzipSourceFiles() => ZipFile.ExtractToDirectory(@$"{InFilePath}\in.zip", @$"{InFilePath}\temp");

        public static void DeleteTempFiles()
        {
            var directoryPath = @$"{InFilePath}\temp";
            if (Directory.Exists(directoryPath))
                Directory.Delete(directoryPath, true);
        }

        private static double? GetDoubleValue(string raw) => double.TryParse(raw.Trim(), out var value) ? value : null;
    }
}
