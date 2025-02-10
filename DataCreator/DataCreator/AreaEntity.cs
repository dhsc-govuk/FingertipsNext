using System.Text.Json.Serialization;

namespace DataCreator
{
    public class AreaEntity
    {
        private string areaType;

        public string AreaCode { get; set; }
        public string AreaName { get; set; }
        public string AddressLine1 { get; set; }
        public string AddressLine2 { get; set; }
        public string AddressLine3 { get; set; }
        public string AddressLine4 { get; set; }
        public string Postcode { get; set; }
        public string AreaType { get => areaType.CleanAreaCode(); set => areaType = value; }

        public double Latitude { get; set; }

        public double Longitude { get; set; }

        public string HierarchyType { get; set; }

        public List<AreaRelation> ParentAreas { get; set; }=[];

        public List<AreaRelation> ChildAreas { get; set; }= [];

        public int Level { get; set; }

    }

    public class AreaRelation
    {
        public string AreaCode { get; set; }

        [JsonIgnore]
        public bool IsDirect { get; set; }
    }

    }
