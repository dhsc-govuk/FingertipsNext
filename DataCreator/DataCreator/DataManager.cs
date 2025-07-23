using System.Text.RegularExpressions;
using DataCreator.PholioDatabase;

namespace DataCreator
{
    public class DataManager(PholioDataFetcher pholioDataFetcher)
    {
        private readonly PholioDataFetcher _pholioDataFetcher = pholioDataFetcher;
        private const int MAXNUMBERGPS = 5;
        private const string PERSONS = "Persons";
        private static readonly Dictionary<string, string> _periodMap = new()
        {
                {"1m", PeriodConstants.Monthly},
                {"3m", PeriodConstants.Quarterly},
                {"1y", PeriodConstants.Yearly},
                {"2y", PeriodConstants.TwoYearly},
                {"3y", PeriodConstants.ThreeYearly},
                {"5y", PeriodConstants.FiveYearly}
        };

        public async Task<List<string>> CreateAreaDataAsync()
        {
            var areas = await _pholioDataFetcher.FetchAreasAsync();

            //we don't want all areas except for PCNs and GPs
            var areasWeWant = new List<string>
            {
                //England
                areas.First(area => area.Level == 0).AreaCode
            };

            //we want all nhs and admin regions and CAs (level 1), ICBs and Counties & UAs (level 2) and sub-ICBs and all Districts & UAs (level 3)
            areasWeWant.AddRange(areas.Where(area => area.Level == 1 || area.Level == 2 || area.Level == 3).Select(area => area.AreaCode));

            //All sub ICBs
            var subIcbs = areas.Where(area => area.Level == 3 && area.HierarchyType == "NHS").ToList();

            var chosenPcns = new List<string>();
            var chosenGps = new List<string>();
            foreach (var subIcb in subIcbs)
            {
                var pcnAreaCodes = subIcb.ChildAreas.Select(x => x.AreaCode).Take(MAXNUMBERGPS);

                chosenPcns.AddRange(pcnAreaCodes);
                foreach (var pcnAreaCode in pcnAreaCodes)
                {
                    var gpsForArea = areas.Where(area => area.AreaCode == pcnAreaCode).SelectMany(area => area.ChildAreas).Select(child => child.AreaCode).Take(MAXNUMBERGPS);
                    chosenGps.AddRange(gpsForArea);
                }
            }

            areasWeWant.AddRange(chosenPcns);
            areasWeWant.AddRange(chosenGps);

            var cleanedAreas = new List<AreaEntity>();
            //remove all areas that we don't want
            foreach (var area in areas)
            {
                if (!areasWeWant.Contains(area.AreaCode))
                    continue;
                area.ChildAreas.RemoveAll(a => !areasWeWant.Contains(a.AreaCode));
                cleanedAreas.Add(area);
            }

            DataFileWriter.WriteAreasJsonData(cleanedAreas);

            var simpleAreasWeWant = cleanedAreas.Select(area => new SimpleAreaWithChildren
            {
                AreaCode = area.AreaCode.Trim(),
                AreaName = Regex.Replace(
                    Regex.Replace(area.AreaName.Trim(), @"\bOf\b", "of", RegexOptions.None, TimeSpan.FromMilliseconds(100)),
                    @"\bAnd The\b", "and the", RegexOptions.None, TimeSpan.FromMilliseconds(100)
                ),
                Children = string.Join('|', area.ChildAreas.Select(c => c.AreaCode.Trim())),
                Level = area.Level,
                HierarchyType = area.HierarchyType,
                AreaTypeCode = area.AreaType //rule to get an area type code
                            .Trim()
                            .Replace(' ', '-')
                            .ToLower(),
                AreaType = area.AreaType
            })
            .ToList();
            DataFileWriter.WriteSimpleAreaCsvData("areas", simpleAreasWeWant);
            return areasWeWant;
        }

        public async Task CreateIndicatorDataAsync(List<IndicatorWithAreasAndLatestUpdate> indicatorWithAreasAndLatestUpdates, List<SimpleIndicator> pocIndicators)
        {
            //get the indicator data from the PHOLIO database
            var indicators = (await _pholioDataFetcher.FetchIndicatorsAsync(pocIndicators)).ToList();
            foreach (var indicator in indicators)
            {
                var indicatorData = indicatorWithAreasAndLatestUpdates
                    .FirstOrDefault(indicatorWithAreasAndLatestUpdate => indicatorWithAreasAndLatestUpdate.IndicatorID == indicator.IndicatorID);

                if (indicatorData != null)
                {
                    indicator.AssociatedAreaCodes = indicatorData.AssociatedAreaCodes;
                    indicator.LatestDataPeriod = indicatorData.LatestDataPeriod;
                    indicator.EarliestDataPeriod = indicatorData.EarliestDataPeriod;
                    indicator.HasInequalities = indicatorData.HasInequalities;
                    indicator.HasMultipleAges = indicatorData.HasMultipleAges;
                    indicator.HasMultipleSexes = indicatorData.HasMultipleSexes;
                    indicator.HasMultipleDeprivation = indicatorData.HasMultipleDeprivation;
                }

                var indicatorUsedInPoc = pocIndicators.FirstOrDefault(pocIndicator => pocIndicator.IndicatorID == indicator.IndicatorID);
                if (indicatorUsedInPoc == null)
                {
                    continue;
                }   
                indicator.UsedInPoc = true;
                
                if (!string.IsNullOrEmpty(indicatorUsedInPoc.IndicatorName))
                {
                    indicator.IndicatorName = indicatorUsedInPoc.IndicatorName;
                }
                if (!string.IsNullOrEmpty(indicatorUsedInPoc.Frequency))
                {
                    indicator.Frequency = indicatorUsedInPoc.Frequency;
                }
                indicator.BenchmarkComparisonMethod = indicatorUsedInPoc.BenchmarkComparisonMethod;
                indicator.Polarity = indicatorUsedInPoc.Polarity;
                indicator.RequiresGeoAggregation = indicatorUsedInPoc.RequiresGeoAggregation;

                indicatorUsedInPoc.PeriodType = indicator.PeriodType;
            }
            AddLastUpdatedDate(indicators);

            DataFileWriter.WriteIndicatorsJsonData(indicators.Where(indicator => !indicator.HideInSearch));
            DataFileWriter.WriteSimpleIndicatorCsvData("indicators", indicators.Where(indicator => indicator.UsedInPoc));
            Console.WriteLine($"Saved indicators .csv and .json files");
        }

        private static void AddLastUpdatedDate(List<IndicatorEntity> indicatorEntities)
        {
            var lastUpdatedDates = DataFileReader.GetLastUpdatedDataForIndicators();
            foreach (var indicatorEntity in indicatorEntities)
            {
                var match = lastUpdatedDates.FirstOrDefault(indicatorLastUpdated => indicatorLastUpdated.IndicatorId == indicatorEntity.IndicatorID);
                if (match != null && match.LastUpdatedDate != "undefined")
                    indicatorEntity.LastUpdatedDate = match.LastUpdatedDate;
            }
        }

        public static (List<IndicatorWithAreasAndLatestUpdate>, List<HealthMeasureEntity>) CreateHealthDataAndAgeData(List<string> areasWeWant, List<SimpleIndicator> pocIndicators, IEnumerable<AgeEntity> allAges)
        {
            var healthMeasures = new List<HealthMeasureEntity>(1000000);
            var areasDictionary = areasWeWant.ToDictionary(areaCode => areaCode);
            foreach (var pocIndicator in pocIndicators)
            {
                var healthDataForIndicator = DataFileReader.GetHealthDataForIndicator(pocIndicator.IndicatorID, areasDictionary, pocIndicator.ContainsCumulativePeriodData);
                MapTimePeriodRangesToPeriods(healthDataForIndicator, pocIndicator.ContainsCumulativePeriodData);

                Console.WriteLine($"Grabbed {healthDataForIndicator.Count} points for indicator {pocIndicator.IndicatorID}");
                healthMeasures.AddRange(healthDataForIndicator);
            }
            var usedAges = AddAgeIds(healthMeasures, allAges);

            CreateCategoryData(healthMeasures);

            var indicatorWithAreasAndLatestUpdates = healthMeasures
                .GroupBy(measure => measure.IndicatorId)
                .Select(group => new IndicatorWithAreasAndLatestUpdate
                {
                    IndicatorID = group.Key,
                    AssociatedAreaCodes = group.Select(healthMeasureEntity => healthMeasureEntity.AreaCode).Distinct().ToList(),
                    LatestDataPeriod = group.OrderByDescending(healthMeasureEntity => healthMeasureEntity.Year).First().Year,
                    EarliestDataPeriod = group.OrderBy(healthMeasureEntity => healthMeasureEntity.Year).First().Year,
                    HasInequalities = group.Any(healthMeasureEntity => healthMeasureEntity.Sex != PERSONS || !string.IsNullOrEmpty(healthMeasureEntity.CategoryType)), //if an indicator has any data that is sex specific or has deciles it is said to have inequality data
                    HasMultipleSexes = group.Select(healthMeasureEntity => healthMeasureEntity.Sex).Distinct().Count() > 1,
                    HasMultipleAges = group.Select(healthMeasureEntity => healthMeasureEntity.Age).Distinct().Count() > 1,
                    HasMultipleDeprivation = group.Select(healthMeasureEntity => healthMeasureEntity.CategoryType).Distinct().Count() > 1
                })
                .ToList();
            SetAggregateFlags(indicatorWithAreasAndLatestUpdates, healthMeasures);
            DataFileWriter.WriteAgeCsvData("agedata", usedAges);

            return (indicatorWithAreasAndLatestUpdates, healthMeasures);
        }

        private static void MapTimePeriodRangesToPeriods(List<HealthMeasureEntity> healthDataForIndicator, bool containsCumulativePeriodData)
        {
            foreach (var healthDataPoint in healthDataForIndicator)
            {
                if(containsCumulativePeriodData && healthDataPoint.Period == "3m")
                {
                    healthDataPoint.Period = PeriodConstants.CumulativeQuarterly;
                    continue;
                }
                if (_periodMap.TryGetValue(healthDataPoint.Period, out var mappedValue))
                {
                    healthDataPoint.Period = mappedValue;
                }
                else
                {
                    throw new ArgumentOutOfRangeException(
                        healthDataPoint.Period, healthDataPoint.Period, "does not have a known mapping"
                    );
                }
            }
        }

        private static void SetAggregateFlags(List<IndicatorWithAreasAndLatestUpdate> indicatorWithAreasAndLatestUpdates, List<HealthMeasureEntity> healthMeasures)
        {
            for (var count = 0; count < healthMeasures.Count; count++)
            {
                var healthMeasure = healthMeasures[count];
                var matchingIndicator = indicatorWithAreasAndLatestUpdates.First(x => x.IndicatorID == healthMeasure.IndicatorId);

                if (!matchingIndicator.HasMultipleSexes) //the associated indicator only has 1 sex value
                    healthMeasure.IsSexAggregatedOrSingle = 1;
                else //the associated indicator has more than 1 sex, the health measure could be for 'Persons', 'Male' or 'Female'. If it is 'Persons' set the flag to true, otherwise false
                    healthMeasure.IsSexAggregatedOrSingle = healthMeasure.Sex == PERSONS ? 1 : 0;

                if (!matchingIndicator.HasMultipleAges) //the associated indicator only has 1 age value
                    healthMeasure.IsAgeAggregatedOrSingle = 1;
                else //the associated indicator has more than 1 age, the health measure could be for 'All ages', or others. If it is 'All ages' set the flag to true, otherwise false
                    healthMeasure.IsAgeAggregatedOrSingle = healthMeasure.Age == "All ages" ? 1 : 0;

                //there are 2 indicators that have multiple ages but no aggregate age
                //using the same behaviour as current Fingertips set the default age specifically
                if (healthMeasure.IndicatorId == 93015 && healthMeasure.Age == "19+ yrs")
                    healthMeasure.IsAgeAggregatedOrSingle = 1;
                if (healthMeasure.IndicatorId == 93088 && healthMeasure.Age == "18+ yrs")
                    healthMeasure.IsAgeAggregatedOrSingle = 1;

                if (!matchingIndicator.HasMultipleDeprivation) //the associated indicator only has 1 deprivation value
                    healthMeasure.IsDeprivationAggregatedOrSingle = 1;
                else //the associated indicator has more than 1 deprivation, the health measure could be for 'Persons', or others. If it is 'Persons' set the flag to true, otherwise false
                    healthMeasure.IsDeprivationAggregatedOrSingle = healthMeasure.CategoryType == PERSONS ? 1 : 0;
            }
        }

        private static void CreateCategoryData(List<HealthMeasureEntity> healthMeasures)
        {
            var categoryData = new List<CategoryEntity>();
            foreach (var healthMeasure in healthMeasures.Where(hm => hm.Category != PERSONS))
            {
                healthMeasure.CategoryType = CleanCategoryTypeName(healthMeasure.CategoryType);
                healthMeasure.Category = healthMeasure.Category.Replace(" (IMD2015)", string.Empty).Replace(" (IMD2019)", string.Empty);
                if (categoryData.FirstOrDefault(cd =>
                    cd.CategoryName.Equals(healthMeasure.Category, StringComparison.CurrentCultureIgnoreCase) &&
                    cd.CategoryTypeName.Equals(healthMeasure.CategoryType, StringComparison.CurrentCultureIgnoreCase)) == null)
                {
                    categoryData.Add(new CategoryEntity
                    {
                        CategoryName = healthMeasure.Category,
                        CategoryTypeName = healthMeasure.CategoryType,
                        Sequence = CreateSequenceForCategory(healthMeasure.Category)
                    });
                }
            }

            DataFileWriter.WriteCategoryCsvData("categories", categoryData);
        }


        private static string CleanCategoryTypeName(string originalName)
        {
            const string CountiesAndUa = "Counties and Unitary Authorities";
            const string DistrictAndUa = "Districts and Unitary Authorities";
            const string DeprivationDeciles = "deprivation deciles";
            const string Geography = "geography";
            const string IMD = "Index of Multiple Deprivation";
            const string Year2019 = "2019";
            const string April = "Apr";

            if (originalName.Equals("CCG deprivation deciles in England (IMD2019, 2021 CCGs)", StringComparison.CurrentCultureIgnoreCase))
                return $"Clinical Commissioning Groups {DeprivationDeciles}: 2021 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("County & UA deprivation deciles in England (IMD2015, pre 4/19 geog.)", StringComparison.CurrentCultureIgnoreCase))
                return $"{CountiesAndUa} {DeprivationDeciles}: before {April} {Year2019} {Geography} ({IMD} 2015)";

            if (originalName.Equals("County & UA deprivation deciles in England (IMD2019, 4/19 and 4/20 geog.)", StringComparison.CurrentCultureIgnoreCase))
                return $"{CountiesAndUa} {DeprivationDeciles}: {April} {Year2019} and {April} 2020 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("County & UA deprivation deciles in England (IMD2019, 4/21 geography)", StringComparison.CurrentCultureIgnoreCase))
                return $"{CountiesAndUa} {DeprivationDeciles}: {April} 2021 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("County & UA deprivation deciles in England (IMD2019, 4/23 geography)", StringComparison.CurrentCultureIgnoreCase))
                return $"{CountiesAndUa} {DeprivationDeciles}: {April} 2023 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("District & UA deprivation deciles in England (IMD2015, pre 4/19 geog.)", StringComparison.CurrentCultureIgnoreCase))
                return $"{DistrictAndUa} {DeprivationDeciles}: before {April} {Year2019} {Geography} ({IMD} 2015)";

            if (originalName.Equals("District & UA deprivation deciles in England (IMD2019, 4/19 geog.)", StringComparison.CurrentCultureIgnoreCase))
                return $"{DistrictAndUa} {DeprivationDeciles}: {April} {Year2019} {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("District & UA deprivation deciles in England (IMD2019, 4/20 geog.)", StringComparison.CurrentCultureIgnoreCase))
                return $"{DistrictAndUa} {DeprivationDeciles}: {April} 2020 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("District & UA deprivation deciles in England (IMD2019, 4/21 geography)", StringComparison.CurrentCultureIgnoreCase))
                return $"{DistrictAndUa} {DeprivationDeciles}: {April} 2021 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("District & UA deprivation deciles in England (IMD2019, 4/23 geography)", StringComparison.CurrentCultureIgnoreCase))
                return $"{DistrictAndUa} {DeprivationDeciles}: {April} 2023 {Geography} ({IMD} {Year2019})";

            if (originalName.Equals("General Practice deprivation deciles in England (IMD2010)", StringComparison.CurrentCultureIgnoreCase))
                return $"General Practice {DeprivationDeciles}: ({IMD} 2010)";

            if (originalName.Equals("LSOA11 deprivation deciles within area (IMD  trend)", StringComparison.CurrentCultureIgnoreCase))
                return $"LSOA11 {DeprivationDeciles}: ({IMD} trend)";

            return originalName;
        }

        private static int CreateSequenceForCategory(string categoryName)
        {
            if (categoryName.StartsWith("Most"))
                return 10;
            if (categoryName.StartsWith("Second most"))
                return 9;
            if (categoryName.StartsWith("Third more"))
                return 8;
            if (categoryName.StartsWith("Fourth more"))
                return 7;
            if (categoryName.StartsWith("Fifth more"))
                return 6;
            if (categoryName.StartsWith("Fifth less"))
                return 5;
            if (categoryName.StartsWith("Fourth less"))
                return 4;
            if (categoryName.StartsWith("Third less"))
                return 3;
            if (categoryName.StartsWith("Second least"))
                return 2;
            return 1;
        }

        private static List<AgeEntity> AddAgeIds(List<HealthMeasureEntity> healthMeasures, IEnumerable<AgeEntity> allAges)
        {
            var usedAgeIds = new HashSet<int>();
            for (var count = 0; count < healthMeasures.Count; count++)
            {
                var healthMeasure = healthMeasures[count];
                var ageId = allAges.First(age => age.Age == healthMeasure.Age).AgeID;
                healthMeasure.AgeID = ageId;
                usedAgeIds.Add(ageId);
            }

            return allAges.Where(age => usedAgeIds.Contains(age.AgeID)).ToList();
        }

        public async Task<IEnumerable<AgeEntity>> GetAgeDataAsync() =>
            await _pholioDataFetcher.FetchAgeDataAsync();



    }
}
