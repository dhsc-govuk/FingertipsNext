namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            await _dataManager.CreateAreaDataAsync();
           
        }
    }
}
