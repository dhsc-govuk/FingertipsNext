﻿using LINQtoCSV;

namespace DataCreator
{
    public record IndicatorEntity : SimpleIndicator
    {
        private string _indicatorDefinition;
        private string rationale;
        private string dataSource;
        private string method;
        private string cIMethodDetails;
        private string countSource;
        private string countDefinition;
        private string denominatorSource;
        private string denominatorDefinition;
        private string disclouseControl;
        private string caveats;
        private string copyright;
        private string notes;

        public string DenominatorType { get; set; }

        public string CIMethod { get; set; }
        public string UnitLabel { get; set; }
        public string UnitValue { get; set; }

        public string IndicatorDefinition
        {
            get => _indicatorDefinition.StripHTML();
            set { _indicatorDefinition = value; }
        }

        public string Rationale { get => rationale.StripHTML(); set => rationale = value; }
        public string DataSource { get => dataSource.StripHTML(); set => dataSource = value; }
        public string Method { get => method.StripHTML(); set => method = value; }
        public string StandardPopulation { get; set; }
        public string CIMethodDetails { get => cIMethodDetails.StripHTML(); set => cIMethodDetails = value; }
        public string CountSource { get => countSource.StripHTML(); set => countSource = value; }
        public string CountDefinition { get => countDefinition.StripHTML(); set => countDefinition = value; }
        public string DenominatorSource { get => denominatorSource.StripHTML(); set => denominatorSource = value; }
        public string DenominatorDefinition { get => denominatorDefinition.StripHTML(); set => denominatorDefinition = value; }
        public string DisclouseControl { get => disclouseControl.StripHTML(); set => disclouseControl = value; }
        public string Caveats { get => caveats.StripHTML(); set => caveats = value; }
        public string Copyright { get => copyright.StripHTML(); set => copyright = value; }
        public string Reuse { get; set; }
        public string Notes { get => notes.StripHTML(); set => notes = value; }
        public string Rounding { get; set; }

        public List<string> AssociatedAreaCodes { get; set; } = [];

        public int LatestDataPeriod { get; set; } = 1999;
        public int EarliestDataPeriod { get; set; } = 1999;

        public string LastUpdatedDate { get; set; }

        public bool UsedInPoc { get; set; }

        public bool HasInequalities { get; set; }
        
        // //indicators 337 and 92708 are population indicators and we don't them to appear in search results
        public bool HideInSearch => IndicatorID == 337 || IndicatorID == 92708;
    }

    public record SimpleIndicator
    {
        [CsvColumn(FieldIndex = 1)]
        public int IndicatorID { get; set; }

        [CsvColumn(FieldIndex = 2)]
        public string Polarity { get; set; }

        [CsvColumn(FieldIndex = 3)]
        public string BenchmarkComparisonMethod { get; set; }

        [CsvColumn(FieldIndex = 4)]
        public string ValueType { get; set; }

        [CsvColumn(FieldIndex = 5)]
        public string IndicatorName { get; set; }

        [CsvColumn(FieldIndex = 6)]
        public string PeriodType { get; set; }
        public string YearType { get; set; }

        [CsvColumn(FieldIndex = 7)]
        public string Frequency { get; set; }

        public bool HasMultipleSexes { get; set; }

        public bool HasMultipleAges { get; set; }

        public bool HasMultipleDeprivation { get; set; }
    }

    public record IndicatorWithAreasAndLatestUpdate
    {
        public int IndicatorID { get; set; }

        public int LatestDataPeriod { get; set; }

        public int EarliestDataPeriod { get; set; }

        public List<string> AssociatedAreaCodes { get; set; } = [];

        public bool HasInequalities { get; set; }

        public bool HasMultipleSexes { get; set; }

        public bool HasMultipleAges { get; set; }

        public bool HasMultipleDeprivation { get; set; }
    }
}




