namespace DataCreator
{
    public class HealthMeasureEntity : SimpleHealthMeasureEntity
    {

        public string Age { get; set; }

        public string CategoryType { get; set; }

        public string Category { get; set; }

    }

    public class SimpleHealthMeasureEntity 
    {
        public int IndicatorId { get; set; }
        public int Year { get; set; }
        public int AgeID { get; set; }
        public string Sex { get; set; }
        public string AreaCode { get; set; }
        public double? Count { get; set; }
        public double? Value { get; set; }
        public double? LowerCI { get; set; }
        public double? UpperCI { get; set; }
        public double? Denominator { get; set; }
        public string Trend { get; set; }

        public int? CategoryTypeId { get; set; }

        public int? CategoryId { get; set; }
    }
}
