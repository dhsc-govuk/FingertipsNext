namespace DHSC.FingertipsNext.Modules.Core;

public interface IWeatherFactory
{
    public WeatherForecast CreateWeather(int index);
}