namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvValidationError(string value, int row, int column)
{
    public string Value { get; set; } = value;
    public int Row { get; set; } = row;
    public int Column { get; set; } = column;

    public string ErrorMessage => $"The value: '{Value}' is invalid. At row {Row} in column {Column}.";
}