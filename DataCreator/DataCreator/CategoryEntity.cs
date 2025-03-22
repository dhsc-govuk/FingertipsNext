using LINQtoCSV;

namespace DataCreator
{
    public record CategoryEntity
    {
        [CsvColumn(FieldIndex = 1)]
        public string CategoryName { get; set; }
        
        [CsvColumn(FieldIndex = 2)]
        public string CategoryTypeName { get; set; }

        [CsvColumn(FieldIndex = 3)]
        public int Sequence { get; set; }
    }
}
