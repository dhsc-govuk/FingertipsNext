import { HttpResponse, http } from 'msw';
import { mockWeatherForecasts } from '../data/forecasts';

const baseURL = process.env.FINGERTIPS_API_URL;

let i = 0;
const next = () => {
  if (i === Number.MAX_SAFE_INTEGER - 1) {
    i = 0;
  }
  return i++;
};

export const handlers = [
  http.get(`${baseURL}/WeatherForecast`, async () => {
    const resultArray = [[getGetWeatherForecast200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
];

export function getGetWeatherForecast200Response() {
  return mockWeatherForecasts;
}
