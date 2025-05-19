namespace DataCreator
{
    public class DataCreatorApplication(DataManager dataManager)
    {
        private readonly DataManager _dataManager= dataManager;

        public async Task CreateDataAsync()
        {
            //we have zipped up the source data to save space to unzip to get them ready
            DataFileReader.DeleteTempFiles();

            DataFileReader.UnzipSourceFiles();
            Console.WriteLine("Unzipped source CSV files");
            //get the ids of the indicators chosen for PoC (about 30)
            var pocIndicators=DataFileReader.GetPocIndicators();
            Console.WriteLine($"Got {pocIndicators.Count} indicators");
            //get the age data - this is age range data
            var ageData= await _dataManager.GetAgeDataAsync();
            Console.WriteLine($"Got age data");
            //create the area chosen for PoC
            var areasWeWant=await _dataManager.CreateAreaDataAsync();
            Console.WriteLine($"Created areas, we are using {areasWeWant.Count} areas");
            //create the health data and write AgeData to file
            var (areasAndIndicators, healthMeasures)=  DataManager.CreateHealthDataAndAgeData(areasWeWant, pocIndicators, ageData);
            Console.WriteLine($"Created all health data");
            //create the indicator data and write to csv
            await _dataManager.CreateIndicatorDataAsync(areasAndIndicators, pocIndicators, addAreasToIndicator: true);
            Console.WriteLine($"Created all indicator data");
            //add period data to health data
            DataManager.CreateHealthMeasurePeriodDates(pocIndicators, healthMeasures);
            Console.WriteLine($"Created period data for all health measures");
            // write the healthdata to file
            DataFileWriter.WriteHealthCsvData("healthdata", healthMeasures);
            Console.WriteLine($"health data written to healthdata.csv");
            
            // TODO: zip the file
            // TODO: unzip the file in pipeline
            
            //clean up the unzipped files
            DataFileReader.DeleteTempFiles();
            Console.WriteLine($"Deleted temp files");
        }
    }
}
