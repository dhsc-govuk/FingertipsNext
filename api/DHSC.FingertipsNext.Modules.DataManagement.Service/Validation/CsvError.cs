namespace DHSC.FingertipsNext.Modules.DataManagement.Service.Validation;

public class CsvError(string value)
{
    public string Value { get; set; } = value;
    public virtual string ErrorMessage => Value;
}