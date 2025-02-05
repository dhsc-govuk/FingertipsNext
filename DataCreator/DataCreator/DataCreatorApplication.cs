namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            await _dataManager.CreateHealthDataAsync();
            await _dataManager.CreateIndicatorDataAsync(addAreasToIndicator: true);
            await _dataManager.CreateAreaDataAsync(addLongLat:false);
           
        }
    }
}
