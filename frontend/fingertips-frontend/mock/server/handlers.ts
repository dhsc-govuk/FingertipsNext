import { HttpResponse, http } from 'msw';
import { mockWeatherForecasts } from '../data/forecasts';
import { faker } from '@faker-js/faker';
import {
  mockAreaData,
  mockAvailableAreasInGroup,
  mockAvailableGroupTypes,
} from '../data/area';

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
  // http.get(`${baseURL}/area/:areaCode`, () => {
  //   return HttpResponse.json(mockAreaData);
  // }),
  // http.get(`${baseURL}/area/groupType/:groupTypeId`, () => {
  //   return HttpResponse.json(mockAvailableGroupTypes);
  // }),
  // http.get(`${baseURL}/area/group/:groupId`, () => {
  //   return HttpResponse.json(mockAvailableAreasInGroup);
  // }),
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
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map(() => ({
    areaCode: 'A1426',
    healthData: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map(() => ({
      year: 2023,
      count: 222,
      value: 506.60912,
      lowerCi: 441.69151,
      upperCi: 578.32766,
    })),
  }));
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
