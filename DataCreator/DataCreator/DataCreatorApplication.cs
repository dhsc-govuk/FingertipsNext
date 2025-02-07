namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            var indicatorIds=DataFileManager.GetIndicatorIds();
            var areasWeWant=await _dataManager.CreateAreaDataAsync(addLongLat: false);
            var ageIds=await _dataManager.CreateHealthDataAsync(areasWeWant, indicatorIds, useIndicators:false);
            await _dataManager.CreateIndicatorDataAsync(addAreasToIndicator: true);
            await _dataManager.CreateAgeDataAsync(ageIds);

        }
    }
}
