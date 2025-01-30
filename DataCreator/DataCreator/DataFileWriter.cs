using System.Text.Json;

namespace DataCreator
{
    public class DataFileWriter
    {
        
        public static void WriteData(string dataType, object data)
        {
            File.WriteAllText($@"..\..\..\data\{dataType}.json", JsonSerializer.Serialize(data, new JsonSerializerOptions
            {
                PropertyNamingPolicy = JsonNamingPolicy.CamelCase
            }));
        }
    }
}
