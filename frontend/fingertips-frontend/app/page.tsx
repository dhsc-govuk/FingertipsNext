import { HomePage } from '@/components/pages/home';
import { WeatherForecastApi } from '@/generated-sources/openapi/src';

export default async function Home() {
  const forecastApi = new WeatherForecastApi();
  const forecasts = await forecastApi.getWeatherForecast();

  if (forecasts.length > 0) {
    return <HomePage forecasts={forecasts} />;
  }
}
