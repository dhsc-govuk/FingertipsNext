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
        public double? LowerCI { get; set; }
        public double? UpperCI { get; set; }  
        public double? Denominator { get; set; }
        public string Trend { get; set; }
        
        public string Sex { get; set; }

        public string Age { get; set; }
    }
}
