using System.Text.RegularExpressions;
using CsvHelper;
using CsvHelper.Configuration;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class UploadedIndicatorDataRow
{
    public required string AreaCode { get; set; }
    public required string DateFrom { get; set; }
    public required string DateTo { get; set; }
    public required string PeriodType { get; set; }
    public required string Sex { get; set; }
    public int? AgeFromYearsInclusive { get; set; }
    public int? AgeToYearsInclusive { get; set; }
    public int? DeprivationDecile { get; set; }
    public string? DeprivationCategory { get; set; }
    public required int? Count { get; set; }
    public required int? Value { get; set; }
    public required double? Denominator { get; set; }
    public required double? LowerCi95 { get; set; }
    public required double? UpperCi95 { get; set; }
    public required double? LowerCi99 { get; set; }
    public required double? UpperCi99 { get; set; }
}

public sealed class UploadedIndicatorDataRowMap : ClassMap<UploadedIndicatorDataRow>
{
    const string DateFormatRegex = @"\d{4}-\d{2}-\d{2}";

    public UploadedIndicatorDataRowMap()
    {
        Regex dateRegex = new Regex(DateFormatRegex);

        Map(m => m.AreaCode).Name("area_code");

        Map(m => m.DateFrom).Name("date_from")
            .Validate(args => dateRegex.IsMatch(args.Field));

        Map(m => m.DateTo).Name("date_to")
            .Validate(args => dateRegex.IsMatch(args.Field));

        Map(m => m.PeriodType).Name("period_type");

        Map(m => m.Sex).Name("sex");

        Map(m => m.AgeFromYearsInclusive).Name("age_from_years_inclusive");

        Map(m => m.AgeToYearsInclusive).Name("age_to_years_inclusive");

        Map(m => m.DeprivationDecile).Name("deprivation_decile");

        Map(m => m.DeprivationCategory).Name("deprivation_category");

        Map(m => m.Count).Name("count");

        Map(m => m.Value).Name("value");

        Map(m => m.Denominator).Name("denominator");

        Map(m => m.LowerCi95).Name("lower_ci_95");

        Map(m => m.UpperCi95).Name("upper_ci_95");

        Map(m => m.LowerCi99).Name("lower_ci_99_8");

        Map(m => m.UpperCi99).Name("upper_ci_99_8");
    }
}