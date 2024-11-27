namespace DHSC.FingertipsNext.Modules.Core;

public class WeatherFactory : IWeatherFactory
{
    public WeatherForecast CreateWeather(int index)
    {
        string[] summaries = new[]
        {
            "Sub-zero", "Jacket Weather", "Breezy", "OK", "Toasty", "Hot hot hot", "Ridiculous", "Scorchio"
        };

        return new WeatherForecast
        {
            Date = DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
            TemperatureC = Random.Shared.Next(-20, 55),
            Summary = summaries[Random.Shared.Next(summaries.Length)]
        };
    }
}