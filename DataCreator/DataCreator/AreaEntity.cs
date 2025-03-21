using System.Text.Json.Serialization;
using LINQtoCSV;

namespace DataCreator
{
    public record AreaEntity :SimpleArea
    {
       
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }

        public List<AreaRelation> ChildAreas { get; set; }= [];

    }

    public record SimpleArea
    {
        private string areaCode;

        [CsvColumn(FieldIndex = 2)]
        public string AreaCode { get => areaCode.CleanAreaCode(); set => areaCode = value; }
        
        [CsvColumn(FieldIndex = 3)]
        public string AreaName { get; set; }

        [CsvColumn(FieldIndex = 4)]
        public int Level { get; set; }

        [CsvColumn(FieldIndex = 5)]
        public string HierarchyType { get; set; }

        [CsvColumn(FieldIndex = 6)]
        public string AreaType { get; set; }

        [CsvColumn(FieldIndex = 7)]
        public string AreaTypeCode { get; set; }
    }

    public record SimpleAreaWithChildren : SimpleArea
    {
        [CsvColumn(FieldIndex = 1)]
        public string Children { get; set; }
    }

    public record AreaRelation
    {
        public string AreaCode { get; set; }

        [JsonIgnore]
        public bool IsDirect { get; set; }
    }

 }
