namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {

            //we have zipped up the source data to save space to unzip to get them ready

            try
            {
                DataFileManager.DeleteTempFiles();
            }
            catch
            {

            }

            DataFileManager.UnzipSourceFiles();
            Console.WriteLine("Unzipped source CSV files");
            //get the ids of the indicators chosen for PoC (about 30)
            var indicatorIds=DataFileManager.GetIndicatorIds();
            Console.WriteLine($"Got {indicatorIds.Count()} indicators ids");
            //get the age data - this is age range data
            var ageData= await _dataManager.GetAgeDataAsync();
            Console.WriteLine($"Got age data");
            //create the area chosen for PoC
            var areasWeWant=await _dataManager.CreateAreaDataAsync(addLongLat: false);
            Console.WriteLine($"Created areas, we are using {areasWeWant.Count} areas");
            //create the health data
            var areasAndIndicators=DataManager.CreateHealthDataAndAgeData(areasWeWant, indicatorIds, ageData, yearFrom:2018, useIndicators:false);
            Console.WriteLine($"Created all health data");
            //create the indicator data
            await _dataManager.CreateIndicatorDataAsync(areasAndIndicators, indicatorIds, addAreasToIndicator: true);
            Console.WriteLine($"Created all health data");
            //clean up the unzipped files
            DataFileManager.DeleteTempFiles();
            Console.WriteLine($"Deleted temp files");
            //put the files where people need them
            DataFileManager.CopyFilesToTargetLocations();
            Console.WriteLine($"Files copied to target");

        }
    }
}
