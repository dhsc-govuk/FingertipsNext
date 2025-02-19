using System.Text.Json.Serialization;

namespace DataCreator
{
    public record AreaEntity :SimpleArea
    {
       
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        
        public List<AreaRelation> ParentAreas { get; set; }=[];

        public List<AreaRelation> ChildAreas { get; set; }= [];

    }

    public record SimpleArea
    {
        private string areaCode;

        public string AreaCode { get => areaCode.CleanAreaCode(); set => areaCode = value; }
        public string AreaName { get; set; }

        public int Level { get; set; }

        public string HierarchyType { get; set; }

        public string AreaType { get; set; }

        public string AreaTypeCode { get; set; }
    }

    public record SimpleAreaWithRelations : SimpleArea
    {
        public string Children { get; set; }

        public string Parents { get; set; }
    }

    public record AreaRelation
    {
        public string AreaCode { get; set; }

        [JsonIgnore]
        public bool IsDirect { get; set; }
    }

 }
