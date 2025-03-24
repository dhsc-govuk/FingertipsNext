using LINQtoCSV;

namespace DataCreator
{
    public record AgeEntity
    {
        [CsvColumn(FieldIndex = 1)]
        public int AgeID { get; set; }

        [CsvColumn(FieldIndex = 2)]
        public string Age { get; set; }
        
        [CsvColumn(FieldIndex = 3)]
        public int MinYears { get; set; }

        [CsvColumn(FieldIndex = 4)]
        public int MaxYears { get; set; }
    }
}
