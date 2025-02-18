namespace DataCreator
{
    public class HealthMeasureEntity
    {
        public int IndicatorId { get; set; }
        public int Year { get; set; }
        public int AgeID { get; set; }
        public int SexID { get; set; }  
        public string AreaCode { get; set; }  
        public double? Count { get; set; }
        public double? Value { get; set; }  
        public double? Lower95CI { get; set; }
        public double? Upper95CI { get; set; }
        public double? Lower98CI { get; set; }
        public double? Upper98CI { get; set; }
        public double? Denominator { get; set; }
        public string Trend { get; set; }
        
        public string Sex { get; set; }

        public string Age { get; set; }

        public string CategoryType { get; set; }

        public string Category { get; set; }

        public int? CategoryTypeId { get; set; }

        public int? CategoryId { get; set; }
    }
}
