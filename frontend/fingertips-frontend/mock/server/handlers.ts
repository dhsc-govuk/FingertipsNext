import { HttpResponse, http } from 'msw';
import { mockWeatherForecasts } from '../data/forecasts';
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
  http.get(`${baseURL}/areas/hierarchies`, async () => {
    const resultArray = [
      [await getGetAreaHierarchies200Response(), { status: 200 }],
      [await getGetAreaHierarchies500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/areatypes`, async () => {
    const resultArray = [[getGetAreaTypes200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/:areaCode`, async () => {
    const resultArray = [
      [await getGetArea200Response(), { status: 200 }],
      [await getGetArea400Response(), { status: 400 }],
      [await getGetArea500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/root`, async () => {
    const resultArray = [
      [await getGetAreaRoot200Response(), { status: 200 }],
      [await getGetAreaRoot500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
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
];

export function getGetAreaHierarchies200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => faker.lorem.words());
}

export function getGetAreaHierarchies500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetAreaTypes200Response() {
  return [
    'Integrated Care Board sub-locations',
    'Integrated Care Board pub-locations',
    'Integrated Care Board hub-locations',
    'Integrated Care Board tub-locations',
  ];
}

export function getGetArea200Response() {
  return {
    code: 'E06000047',
    name: 'County Durham',
    hierarchyName: 'NHS',
    areaType: 'PCN',
    level: '3',
    parent: {
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: '3',
    },
    children: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: '3',
    })),
    siblings: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: '3',
    })),
    cousins: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: '3',
    })),
    ancestors: [
      ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
    ].map((_) => ({
      code: 'E06000047',
      name: 'County Durham',
      hierarchyName: 'NHS',
      areaType: 'PCN',
      level: '3',
    })),
  };
}

export function getGetArea400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetArea500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetAreaRoot200Response() {
  return {
    code: 'E92000001',
    name: 'England',
  };
}

export function getGetAreaRoot500Response() {
  return {
    message: faker.lorem.words(),
  };
}

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
