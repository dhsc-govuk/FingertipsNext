import { HttpResponse, http } from 'msw';
import { mockWeatherForecasts } from '../data/forecasts';
import { mockPopulationData } from '../data/populationdata';
import { faker } from '@faker-js/faker';
import { mockHealthData } from '@/mock/data/healthdata';

faker.seed(1);

const baseURL = process.env.FINGERTIPS_API_URL;
const MAX_ARRAY_LENGTH = 20;

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
  http.get(`${baseURL}/indicators`, async () => {
    const resultArray = [[getFilterIndicators200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/indicators/:indicatorId`, async () => {
    const resultArray = [[getGetIndicator200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/indicators/:indicatorId/data`, async () => {
    const resultArray = [
      [getGetHealthDataForAnIndicator200Response(), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/population/data`, async () => {
    const resultArray = [
      [await getGetAreasPopulationData200Response(), { status: 200 }],
      [await getGetAreasPopulationData400Response(), { status: 400 }],
      [await getGetAreasPopulationData404Response(), { status: 404 }],
      [await getGetAreasPopulationData500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
];

export function getGetWeatherForecast200Response() {
  return mockWeatherForecasts;
}

export function getFilterIndicators200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map(() => ({
    indicator_id: 3456,
    title: 'Hypertension: QOF prevalence (all ages)',
  }));
}

export function getFilterIndicators400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getFilterIndicators500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetIndicator200Response() {
  return {
    indicator_id: 3456,
    title: 'Hypertension: QOF prevalence (all ages)',
    definition:
      'The percentage of patients with established hypertension, as recorded on practice disease registers (proportion of total list size)',
  };
}

export function getGetIndicator404Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetIndicator500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetHealthDataForAnIndicator200Response() {
  return mockHealthData;
}

export function getGetHealthDataForAnIndicator400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetHealthDataForAnIndicator500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetAreasPopulationData200Response() {
  return mockPopulationData;
}

export function getGetAreasPopulationData400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetAreasPopulationData404Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetAreasPopulationData500Response() {
  return {
    message: faker.lorem.words(),
  };
}
