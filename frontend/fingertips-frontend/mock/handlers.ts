import { http, HttpResponse } from 'msw';
import { mockWeatherForecasts } from './data/forecasts';

export const handlers = [
  http.get(`${process.env.FINGERTIPS_API_URL}/WeatherForecast`, () =>
    HttpResponse.json(mockWeatherForecasts)
  ),
];
