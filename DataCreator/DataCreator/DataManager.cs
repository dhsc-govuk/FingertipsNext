using System.Data;
using DataCreator.PholioDatabase;

namespace DataCreator
{
    public class DataManager(PholioDataFetcher pholioDataFetcher, PostcodeFetcher postcodeFetcher)
    {
        private readonly PholioDataFetcher _pholioDataFetcher = pholioDataFetcher;
        private readonly PostcodeFetcher _postcodeFetcher = postcodeFetcher;

        public async Task<List<string>> CreateAreaDataAsync(bool addLongLat)
        {
            var areas = await _pholioDataFetcher.FetchAreasAsync();
            if (addLongLat)
                await AddLongLat(areas);

            var areasWeWant=new List<string>();
            var england=areas.FirstOrDefault(area => area.Level == 0);
            
            var level1s = areas.Where(area => area.Level == 1 ).ToList(); //nhs and admin regions
            var northWestAdmin= areas.First(area => area.AreaCode == "E12000002");
            var northWestNHS= areas.First(area => area.AreaCode == "E40000010");
            var childrenOfNorthWestAdmin = GetChildren(areas, northWestAdmin); //UA
            var grandchildrenOfNorthWestAdmin = GetChildren(areas, childrenOfNorthWestAdmin); //district
            var childrenOfNorthWestNHS = GetChildren(areas, northWestNHS); //ICB
            var grandchildrenOfNorthWestNHS = GetChildren(areas, childrenOfNorthWestNHS); //sub icb
            var greatGrandchildrenOfNorthWestNHS = GetChildren(areas, grandchildrenOfNorthWestNHS).Take(30).ToList(); //30 PCN or GP
            var greatgreatGrandchildrenOfNorthWestNHS = GetChildren(areas, greatGrandchildrenOfNorthWestNHS).Take(30).ToList(); //30 GP

            areasWeWant.Add(england.AreaCode);
            areasWeWant.AddRange(childrenOfNorthWestAdmin.Select(area => area.AreaCode));
            areasWeWant.AddRange(grandchildrenOfNorthWestAdmin.Select(area => area.AreaCode));
            areasWeWant.AddRange(childrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(grandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(greatGrandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            areasWeWant.AddRange(greatgreatGrandchildrenOfNorthWestNHS.Select(area => area.AreaCode));
            DataFileManager.WriteJsonData("areas", areas);
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

        public async Task CreateIndicatorDataAsync(bool addAreasToIndicator)
        {
            var indicators = await _pholioDataFetcher.FetchIndicatorsAsync(addAreasToIndicator);
            DataFileManager.WriteJsonData("indicators", indicators);
        }

        public static void CreateHealthDataAndAgeData(List<string> areasWeWant, IEnumerable<int> indicatorIdsWeWant, IEnumerable<AgeEntity> allAges, int yearFrom, bool useIndicators=false)
        {
            var healthMeasures = new List<HealthMeasureEntity>();
            foreach (var indicatorId in indicatorIdsWeWant)
            {
                healthMeasures.AddRange(GetHealthDataForArea(indicatorId, areasWeWant, yearFrom));
            }
            var usedAges = AddAgeIds(healthMeasures, allAges);
            AddSexIds(healthMeasures);
            DataFileManager.WriteAgeCsvData("agedata", usedAges);
            DataFileManager.WriteHealthCsvData("healthdata", healthMeasures);
        }

        private static IEnumerable<AgeEntity> AddAgeIds(List<HealthMeasureEntity> healthMeasures, IEnumerable<AgeEntity> allAges)
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

        private static IEnumerable<HealthMeasureEntity> GetHealthDataForArea(int indicatorId, List<string> areasWeWant, int yearFrom = 2018)
        {
            var data = DataFileManager.GetHealthDataForIndicator(indicatorId);
            var dataForAreasWeWant = data.Where(x => areasWeWant.Contains(x.AreaCode)).ToList();
            return dataForAreasWeWant.Where(x => x.Year >= yearFrom).ToList();
        }
      

        public async Task<IEnumerable<AgeEntity>> GetAgeDataAsync()
        {
            return await _pholioDataFetcher.FetchAgeDataAsync();
        }

    }
}
