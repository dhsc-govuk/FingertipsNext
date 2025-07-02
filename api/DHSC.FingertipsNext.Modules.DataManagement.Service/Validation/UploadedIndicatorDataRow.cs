using System.Globalization;
using System.Net.Http.Headers;
using System.Reflection;
using System.Text.RegularExpressions;
using CsvHelper;
using CsvHelper.Configuration;
using CsvHelper.Configuration.Attributes;

namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class UploadedIndicatorDataRow
{
    [Name("area_code")]
    public required string AreaCode { get; set; }

    [Name("date_from")]
    public required string DateFrom { get; set; }

    [Name("date_to")]
    public required string DateTo { get; set; }

    [Name("period_type")]
    public required string PeriodType { get; set; }

    [Name("sex")]
    public required string Sex { get; set; }

    [Name("age_from_years_inclusive")]
    public int? AgeFromYearsInclusive { get; set; }

    [Name("age_to_years_inclusive")]
    public int? AgeToYearsInclusive { get; set; }

    [Name("deprivation_decile")]
    public int? DeprivationDecile { get; set; }

    [Name("deprivation_category")]
    public string? DeprivationCategory { get; set; }

    [Name("count")]
    public int? Count { get; set; }

    [Name("value")]
    public int? Value { get; set; }

    [Name("denominator")]
    public double? Denominator { get; set; }

    [Name("lower_ci_95")]
    public double? LowerCi95 { get; set; }

    [Name("upper_ci_95")]
    public double? UpperCi95 { get; set; }

    [Name("lower_ci_99_8")]
    public double? LowerCi99 { get; set; }

    [Name("upper_ci_99_8")]
    public double? UpperCi99 { get; set; }

    public static IList<string> GetHeaders()
    {
        List<string> headerNames = new List<string>();
        PropertyInfo[] properties = typeof(UploadedIndicatorDataRow).GetProperties();
        foreach (var property in properties)
        {
            var attributes = property.GetCustomAttributes(typeof(NameAttribute), false);
            foreach (var attr in attributes)
            {
                NameAttribute? nameAttribute = attr as NameAttribute;
                if (nameAttribute != null)
                {
                    headerNames.Add(nameAttribute.Names[0]);
                }
            }
        }
        return headerNames;
    }
}

public sealed class UploadedIndicatorDataRowMap : ClassMap<UploadedIndicatorDataRow>
{
    public UploadedIndicatorDataRowMap()
    {
        AutoMap(CultureInfo.InvariantCulture);
        Map(m => m.DateFrom).Validate(args => IsValidDate(args.Field));
        Map(m => m.DateTo).Validate(args => IsValidDate(args.Field));
    }

    private static bool IsValidDate(string date)
    {
        return DateTime.TryParseExact(date, "yyyy-MM-dd", CultureInfo.InvariantCulture, DateTimeStyles.None, out _);
    }
}