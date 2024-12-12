import { HomePage } from '@/components/pages/home';
import { WeatherForecastApi } from '@/generated-sources/openapi/src';

export default async function Home() {
  const forecastApi = new WeatherForecastApi();
  const forecasts = await forecastApi.getWeatherForecast();

  return <HomePage forecasts={forecasts} />;
}
