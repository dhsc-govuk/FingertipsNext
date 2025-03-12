using System.Data;
using DataCreator.PholioDatabase;

namespace DataCreator
{
    public class DataManager(PholioDataFetcher pholioDataFetcher, PostcodeFetcher postcodeFetcher)
    {
        private readonly PholioDataFetcher _pholioDataFetcher = pholioDataFetcher;
        private readonly PostcodeFetcher _postcodeFetcher = postcodeFetcher;
        private const int MAXNUMBERGPS = 200;

        public async Task<List<string>> CreateAreaDataAsync(bool addLongLat)
        {
            var areas = await _pholioDataFetcher.FetchAreasAsync();
            //it has been decided we are not doing anything with geospatial search for PoC so adding lat / long data is not needed - leaving the code here in case it comes back
            if (addLongLat) //will be false for Po
                await AddLongLat(areas);

            //we don't want all areas, just areas in the north west - the rest of this code is about selecting those
            var areasWeWant=new List<string>();

            //we want England
            var england=areas.FirstOrDefault(area => area.Level == 0);

            //we want all areas in the next level down - nhs and admin regions
            var level1s = areas.Where(area => area.Level == 1 ).ToList();

            //now choose all NHS and Admin areas in the North West
            var northWestAdmin= areas.First(area => area.AreaCode == "E12000002");
            var northWestNHS= areas.First(area => area.AreaCode == "E40000010");
            var childrenOfNorthWestAdmin = GetChildren(areas, northWestAdmin); //UA
            var grandchildrenOfNorthWestAdmin = GetChildren(areas, childrenOfNorthWestAdmin); //district
            var childrenOfNorthWestNHS = GetChildren(areas, northWestNHS); //ICB
            var grandchildrenOfNorthWestNHS = GetChildren(areas, childrenOfNorthWestNHS); //sub icb
            var greatGrandchildrenOfNorthWestNHS = GetChildren(areas, grandchildrenOfNorthWestNHS).Take(MAXNUMBERGPS).ToList(); //subset of PCNs
            var greatgreatGrandchildrenOfNorthWestNHS = GetChildren(areas, greatGrandchildrenOfNorthWestNHS).Take(MAXNUMBERGPS).ToList();  //subset of GPs

            areasWeWant.Add(england.AreaCode);
            areasWeWant.AddRange(level1s.Select(l=>l.AreaCode));
            areasWeWant.AddRange(childrenOfNorthWestAdmin.Select(area => area.AreaCode));
            areasWeWant.AddRange(grandchildrenOfNorthWestAdmin.Select(area => area.AreaCode));
            areasWeWant.AddRange(childrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(grandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(greatGrandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(greatgreatGrandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            DataFileManager.WriteJsonData("areas", areas.Distinct());

            var simpleAreasWeWant = areas.Select(area => new SimpleAreaWithRelations
            {
                AreaCode = area.AreaCode.Trim(),
                AreaName = area.AreaName.Trim(),
                Parents = string.Join('|', area.ParentAreas.Select(p => p.AreaCode.Trim())),
                Children = string.Join('|', area.ChildAreas.Select(c => c.AreaCode.Trim())),
                Level = area.Level,
                HierarchyType = area.HierarchyType,
                AreaTypeCode = area.AreaType
                            .Trim()
                            .Replace(' ', '-')
                            .ToLower(),
                AreaType = area.AreaType
            })
            .ToList();
            DataFileManager.WriteSimpleAreaCsvData("areas", simpleAreasWeWant);
            return areasWeWant;
        }

        private static List<AreaEntity> GetChildren(IEnumerable<AreaEntity> areas, AreaEntity myArea) => 
            areas.Where(area => myArea.ChildAreas.Select(x => x.AreaCode).ToList().Contains(area.AreaCode)).ToList();

        private static List<AreaEntity> GetChildren(IEnumerable<AreaEntity> areas, List<AreaEntity> myAreas) =>
             areas.Where(area => myAreas.SelectMany(x => x.ChildAreas).Select(x => x.AreaCode).ToList().Contains(area.AreaCode)).ToList();

        private async Task AddLongLat(IEnumerable<AreaEntity> areas)
        {
            var postcodes = await _postcodeFetcher.FetchAsync();

            var notMatched = 0;
            foreach (var area in areas.Where(g => g.Postcode != null))
            {
                var matched = postcodes.TryGetValue(area.Postcode, out var match);
                if (matched)
                {
                    area.Longitude = match.Longitude;
                    area.Latitude = match.Latitude;
                }
                else
                    notMatched++;
            }
        }

        public async Task CreateIndicatorDataAsync(List<IndicatorWithAreasAndLatestUpdate> indicatorWithAreasAndLatestUpdates, List<SimpleIndicator> pocIndicators, bool addAreasToIndicator)
        {
            var indicators = (await _pholioDataFetcher.FetchIndicatorsAsync(pocIndicators)).ToList();
            foreach (var indicator in indicators) 
            {
                var match=indicatorWithAreasAndLatestUpdates.FirstOrDefault(indicatorWithAreasAndLatestUpdate =>
                    indicatorWithAreasAndLatestUpdate.IndicatorID == indicator.IndicatorID);

                if (match != null)
                {
                    indicator.AssociatedAreaCodes = match.AssociatedAreaCodes;
                    indicator.LatestDataPeriod=match.LatestDataPeriod;
                    indicator.EarliestDataPeriod=match.EarliestDataPeriod;
                    indicator.HasInequalities = match.HasInequalities;
                }
            
                indicator.UsedInPoc=pocIndicators.Select(i=>i.IndicatorID).Contains(indicator.IndicatorID);
                if (indicator.UsedInPoc)
                {
                    var indicatorUsedInPoc = pocIndicators.First(i => i.IndicatorID == indicator.IndicatorID);
                    if(!string.IsNullOrEmpty(indicatorUsedInPoc.IndicatorName))
                        indicator.IndicatorName = indicatorUsedInPoc.IndicatorName;
                    
                    indicator.BenchmarkComparisonMethod=indicatorUsedInPoc.BenchmarkComparisonMethod;   
                    indicator.Polarity=indicatorUsedInPoc.Polarity; 
                }
                    
            }
            AddLastUpdatedDate(indicators);
            var simpleIndicators = indicators.Where(i => i.UsedInPoc).Cast<SimpleIndicator>().ToList();
            DataFileManager.WriteJsonData("indicators", indicators);
            
            DataFileManager.WriteSimpleIndicatorCsvData("indicators", simpleIndicators);
        }

        private static void AddLastUpdatedDate(List<IndicatorEntity> indicatorEntities)
        {
            var lastUpdatedDates = DataFileManager.GetLastUpdatedDataForIndicators();
            foreach (var indicatorEntity in indicatorEntities)
            {
                var match = lastUpdatedDates.FirstOrDefault(l => l.IndicatorId == indicatorEntity.IndicatorID);
                if (match != null && match.LastUpdatedDate!= "undefined") 
                    indicatorEntity.LastUpdatedDate = match.LastUpdatedDate;
            }
        }

        public static List<IndicatorWithAreasAndLatestUpdate> CreateHealthDataAndAgeData(List<string> areasWeWant, List<SimpleIndicator> pocIndicators, IEnumerable<AgeEntity> allAges, int yearFrom, bool useIndicators=false)
        {
            var healthMeasures = new List<HealthMeasureEntity>();
            
            foreach (var pocIndicator in pocIndicators)
            {
                var data = DataFileManager.GetHealthDataForIndicator(pocIndicator.IndicatorID, yearFrom, areasWeWant);
               
                Console.WriteLine($"Grabbed {data.Count} points for indicator {pocIndicator.IndicatorID}");
                healthMeasures.AddRange(data);
            }
            var usedAges = AddAgeIds(healthMeasures, allAges);
            AddSexIds(healthMeasures);
            CreateCategoryData(healthMeasures);

            var indicatorWithAreasAndLatestUpdates = healthMeasures
                .GroupBy(measure => measure.IndicatorId)
                .Select(group => new IndicatorWithAreasAndLatestUpdate
                {
                    IndicatorID = group.Key,
                    AssociatedAreaCodes = group.Select(x => x.AreaCode).Distinct().ToList(),
                    LatestDataPeriod = group.OrderByDescending(g => g.Year).First().Year,
                    EarliestDataPeriod = group.OrderBy(g => g.Year).First().Year,
                    HasInequalities = group.Any(d => d.Sex != "Persons" || !string.IsNullOrEmpty(d.CategoryType)) //if an indicator has any data that is sex specific or has deciles it is said to have inequality data
                })
                .ToList();
            
            DataFileManager.WriteAgeCsvData("agedata", usedAges);
            DataFileManager.WriteHealthCsvData("healthdata", healthMeasures);

            return indicatorWithAreasAndLatestUpdates;
        }

        private static void CreateCategoryData(List<HealthMeasureEntity> healthMeasures)
        {
            var categoryData= new List<CategoryEntity>();
            foreach(var healthMeasure in healthMeasures.Where(hm=>hm.Category!="All"))
            {
                if(categoryData.FirstOrDefault(cd=>
                    cd.CategoryName.Equals(healthMeasure.Category,StringComparison.CurrentCultureIgnoreCase) &&
                    cd.CategoryTypeName.Equals(healthMeasure.CategoryType, StringComparison.CurrentCultureIgnoreCase))==null)
                {
                    categoryData.Add(new CategoryEntity
                    {
                        CategoryName= healthMeasure.Category,
                        CategoryTypeName= healthMeasure.CategoryType,
                        Sequence= CreateSequenceForCategory(healthMeasure.Category)
                    });
                }
            }
            DataFileManager.WriteCategoryCsvData("categories", categoryData);
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
            var usedAgeIds= new HashSet<int>(); 
            
            foreach (var healthMeasure in healthMeasures)
            {
                var ageId = allAges.First(x => x.Age == healthMeasure.Age).AgeID;
                healthMeasure.AgeID = ageId;
                usedAgeIds.Add(ageId);
            }
           
            return allAges.Where(age=>usedAgeIds.Contains(age.AgeID)).ToList();
        }

        private static void AddSexIds(List<HealthMeasureEntity> healthMeasures)
        {
            foreach (var healthMeasure in healthMeasures)
            {
                switch (healthMeasure.Sex)
                {
                    case "Not applicable":
                        healthMeasure.SexID = -1;
                        break;
                    case "Male":
                        healthMeasure.SexID = 1;
                        break;
                    case "Female":
                        healthMeasure.SexID = 2;
                        break;
                    case "Persons":
                        healthMeasure.SexID = 4;
                        break;
                }
            }
        }

        public async Task<IEnumerable<AgeEntity>> GetAgeDataAsync() =>
            await _pholioDataFetcher.FetchAgeDataAsync();

    }
}
