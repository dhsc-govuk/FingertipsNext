namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvValidationError(string value, int row, int column, bool isGeneralError)
{
    public string Value { get; set; } = value;
    public int Row { get; set; } = row;
    public int Column { get; set; } = column;
    public bool IsGeneralError { get; set; } = isGeneralError;

    public string ErrorMessage
    {
        get
        {
            if (IsGeneralError)
            {
                return Value;
            }
            else
            {
                return $"The value: '{Value}' is invalid. At row {Row} in column {Column}.";
            }
        }
    }
}