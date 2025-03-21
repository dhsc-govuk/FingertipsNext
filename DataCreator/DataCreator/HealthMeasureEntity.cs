using LINQtoCSV;

namespace DataCreator
{
    public record HealthMeasureEntity
    {
        [CsvColumn(FieldIndex = 1)]
        public int IndicatorId { get; set; }

        [CsvColumn(FieldIndex = 2)]
        public int Year { get; set; }

        [CsvColumn(FieldIndex = 3)]
        public string AreaCode { get; set; }  

        [CsvColumn(FieldIndex = 4)]
        public double? Count { get; set; }

        [CsvColumn(FieldIndex = 5)]
        public double? Value { get; set; }  

        [CsvColumn(FieldIndex = 6)]
        public double? Lower95CI { get; set; }

        [CsvColumn(FieldIndex = 7)]
        public double? Upper95CI { get; set; }

        [CsvColumn(FieldIndex = 8)]
        public double? Lower98CI { get; set; }

        [CsvColumn(FieldIndex = 9)]
        public double? Upper98CI { get; set; }

        [CsvColumn(FieldIndex = 10)]
        public double? Denominator { get; set; }

        [CsvColumn(FieldIndex = 11)]
        public string Sex { get; set; }

        //don't need this in the csv
        public string Age { get; set; }

        [CsvColumn(FieldIndex = 12)]
        public string CategoryType { get; set; }

        [CsvColumn(FieldIndex = 13)]
        public string Category { get; set; }

        [CsvColumn(FieldIndex = 14)]
        public int AgeID { get; set; }

        [CsvColumn(FieldIndex = 15)]
        public bool IsSexAggregatedOrSingle {  get; set; }

        [CsvColumn(FieldIndex = 16)]
        public bool IsAgeAggregatedOrSingle { get; set; }

        [CsvColumn(FieldIndex = 17)]
        public bool IsDeprivationAggregatedOrSingle { get; set; }
    }
}
