namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            //get the ids of the indicators chosen for PoC (about 30)
            var indicatorIds=DataFileManager.GetIndicatorIds();
            
            //get the age data - this is age range data
            var ageData= await _dataManager.GetAgeDataAsync();

            //create the area chosen for PoC
            var areasWeWant=await _dataManager.CreateAreaDataAsync(addLongLat: false);

            //create the health data
            var areasAndIndicators=DataManager.CreateHealthDataAndAgeData(areasWeWant, indicatorIds, ageData, yearFrom:2018, useIndicators:false);

            //create the indicator data
            await _dataManager.CreateIndicatorDataAsync(areasAndIndicators, addAreasToIndicator: true);

        }
    }
}
