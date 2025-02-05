using DataCreator.PholioDatabase;

namespace DataCreator
{
    public class DataManager(PholioDataFetcher pholioDataFetcher, PostcodeFetcher postcodeFetcher)
    {
        private readonly PholioDataFetcher _pholioDataFetcher = pholioDataFetcher;
        private readonly PostcodeFetcher _postcodeFetcher = postcodeFetcher;
        

        public async Task CreateAreaDataAsync(bool addLongLat)
        {
            var areas = await _pholioDataFetcher.FetchAreasAsync();
            if (addLongLat)
                await AddLongLat(areas);
            DataFileWriter.WriteJsonData("areas", areas);
        }

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
            
            DataFileWriter.WriteJsonData("indicators", indicators);
        }

        public async Task CreateHealthDataAsync()
        {
            var healthMeasures = await _pholioDataFetcher.FetchHealthDataAsync(2018, ["E06000001", "E06000002"], [108,219, 40401]);

            DataFileWriter.WriteHealthCsvData("healthdata", healthMeasures);
        }
    }
}
