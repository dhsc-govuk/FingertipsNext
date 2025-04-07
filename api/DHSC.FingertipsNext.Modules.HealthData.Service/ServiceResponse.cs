namespace DHSC.FingertipsNext.Modules.HealthData.Service;

public class ServiceResponse<T>
{
    public ServiceResponse()
    {
    }

    public ServiceResponse(ResponseStatus status)
    {
        Status = status;
    }
    
    public T Content { get; set; }
    public ResponseStatus Status { get; set; }
}