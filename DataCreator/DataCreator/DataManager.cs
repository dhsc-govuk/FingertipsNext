using System.Collections.Generic;
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

        public async Task<List<int>> CreateHealthDataAsync(List<string> areasWeWant, IEnumerable<int> indicatorIdsWeWant, bool useIndicators=false)
        {
            var healthMeasures = await _pholioDataFetcher.FetchHealthDataAsync(2018, areasWeWant, indicatorIdsWeWant, useIndicators);
            DataFileManager.WriteHealthCsvData("healthdata", healthMeasures);
            return healthMeasures.Select(x=>x.AgeID).Distinct().ToList();
        }

        public async Task CreateAgeDataAsync(IEnumerable<int> ageIdsWeWant)
        {
            var ages = await _pholioDataFetcher.FetchAgeDataAsync(ageIdsWeWant);
            DataFileManager.WriteAgeCsvData("agedata", ages);
        }
    }
}
