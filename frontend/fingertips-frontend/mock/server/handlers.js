import { HttpResponse, http } from 'msw';
import { mockWeatherForecasts } from './../data/forecasts';

const baseURL = process.env.FINGERTIPS_API_URL;

let i = 0;
const next = () => {
  if (i === Number.MAX_SAFE_INTEGER - 1) {
    i = 0;
  }
  return i++;
};

export const handlers = [
  http.get(`${baseURL}/HealthCheck`, async () => {
    const resultArray = [
      [await getGetHealthCheck200Response(), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/Core/forecast`, async () => {
    const resultArray = [
      [await getGetCoreForecast200Response(), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/Core/search-forecast`, async () => {
    const resultArray = [
      [await getGetCoreSearchForecast200Response(), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/WeatherForecast`, async () => {
    const resultArray = [
      [await getGetWeatherForecast200Response(), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/Search`, async () => {
    const resultArray = [[await getGetSearch200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
];

export function getGetHealthCheck200Response() {
  return null;
}

export function getGetCoreForecast200Response() {
  return null;
}

export function getGetCoreSearchForecast200Response() {
  return null;
}

export function getGetWeatherForecast200Response() {
  return mockWeatherForecasts;
}

export function getGetSearch200Response() {
  return null;
}
