namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvDataError(string value, int row, int column) : CsvError(value)
{
    private int Row { get; set; } = row;
    private int Column { get; set; } = column;
    public override string ErrorMessage => $"The value: '{Value}' is invalid. At row {Row} in column {Column}.";
}