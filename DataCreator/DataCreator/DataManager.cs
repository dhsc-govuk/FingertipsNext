using DataCreator.PholioDatabase;

namespace DataCreator
{
    public class DataManager(PholioDataFetcher areaFetcher, PostcodeFetcher postcodeFetcher)
    {
        private readonly PholioDataFetcher _areaFetcher = areaFetcher;
        private readonly PostcodeFetcher _postcodeFetcher = postcodeFetcher;

        public async Task CreateAreaDataAsync()
        {
            var areas = await _areaFetcher.FetchAreasAsync();
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
            DataFileWriter.WriteData("areas", areas);
        }

        public async Task CreateIndicatorDataAsync()
        {
            var areas = await _areaFetcher.FetchAreasAsync();
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
            DataFileWriter.WriteData("areas", areas);
        }
    }
}
