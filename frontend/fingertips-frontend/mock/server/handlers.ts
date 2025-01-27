import { HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { mockHealthData } from '@/mock/data/healthdata';
import { mockAreaData, mockAvailableAreaTypes } from '../data/areaData';

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
    const resultArray = [[getGetAreaHierarchies200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/areatypes`, async () => {
    const resultArray = [[getGetAreaTypes200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  http.get(`${baseURL}/areas/:areaCode`, async ({ params }) => {
    const areaCode = params.areaCode;

    if (typeof areaCode !== 'string') {
      return HttpResponse.json({ error: 'Bad request' }, { status: 400 });
    }
    const resultArray = [[getGetArea200Response(areaCode), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/root`, async () => {
    const resultArray = [[getGetAreaRoot200Response(), { status: 200 }]];

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
  http.get(`${baseURL}/indicators/:indicatorId/data`, async ({ params }) => {
    const indicatorId = params.indicatorId;
    if (typeof indicatorId !== 'string') {
      return HttpResponse.json(getGetHealthDataForAnIndicator400Response(), {
        status: 400,
      });
    }
    const resultArray = [
      [getGetHealthDataForAnIndicator200Response(indicatorId), { status: 200 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
];

export function getGetAreaHierarchies200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => faker.lorem.words());
}

export function getGetAreaTypes200Response() {
  return mockAvailableAreaTypes;
}

export function getGetArea200Response(areaCode: string) {
  return mockAreaData[areaCode];
}

export function getGetAreaRoot200Response() {
  return {
    code: 'E92000001',
    name: 'England',
  };
}

export function getFilterIndicators200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map(() => ({
    indicator_id: 3456,
    title: 'Hypertension: QOF prevalence (all ages)',
  }));
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

export function getGetHealthDataForAnIndicator400Response() {
  return {
    message: 'No health data for indicator',
  };
}

export function getGetHealthDataForAnIndicator200Response(indicatorId: string) {
  if (indicatorId in mockHealthData) {
    return mockHealthData[indicatorId];
  }

  return mockHealthData[1];
}
