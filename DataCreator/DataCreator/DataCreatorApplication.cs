namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            var indicatorIds=DataFileManager.GetIndicatorIds();
            var ageData= await _dataManager.GetAgeDataAsync();
            var areasWeWant=await _dataManager.CreateAreaDataAsync(addLongLat: false);
            DataManager.CreateHealthDataAndAgeData(areasWeWant, indicatorIds, ageData, yearFrom:2018, useIndicators:false);
            await _dataManager.CreateIndicatorDataAsync(addAreasToIndicator: true);

        }
    }
}
