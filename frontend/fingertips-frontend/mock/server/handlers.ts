import { http, HttpResponse } from 'msw';
import { faker } from '@faker-js/faker';
import { mockAreaData, mockAvailableAreas } from '../data/areaData';
import {
  allAreaTypes,
  AreaTypeKeys,
} from '../../lib/areaFilterHelpers/areaType';
import {
  Area,
  AreaWithRelations,
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { ErrorIdPrefix } from '@/mock/ErrorTriggeringIds';
import { mockHealthDataForArea } from '../data/mockHealthDataForArea';
import { mockIndicatorWithHealthDataForArea } from '../data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataPoints } from '../data/mockHealthDataPoint';
import { mockBatch } from '../data/mockBatch';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

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
  http.get(
    `${baseURL}/areas/areatypes/:areaTypeKey/areas`,
    async ({ params }) => {
      const areaTypeKey = params.areaTypeKey as AreaTypeKeys;

      if (typeof areaTypeKey !== 'string') {
        return HttpResponse.json({ error: 'Bad request' }, { status: 400 });
      }

      const resultArray = [
        [getGetAreaTypeMembers200Response(areaTypeKey), { status: 200 }],
      ];

      return HttpResponse.json(...resultArray[next() % resultArray.length]);
    }
  ),
  http.get(`${baseURL}/areas/:areaCode`, async ({ request, params }) => {
    const areaCode = params.areaCode;
    const url = new URL(request.url);
    const includeChildren = url.searchParams.get('include_children') ?? 'false';
    const childAreaType = url.searchParams.get('child_area_type') ?? '';

    if (typeof areaCode !== 'string') {
      return HttpResponse.json({ error: 'Bad request' }, { status: 400 });
    }

    if (areaCode.startsWith(ErrorIdPrefix)) {
      return HttpResponse.json(
        { error: `ERROR Scenario ${areaCode}` },
        { status: 500 }
      );
    }

    const resultArray = [
      [
        getGetArea200Response(areaCode, includeChildren, childAreaType),
        { status: 200 },
      ],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas/root`, async () => {
    const resultArray = [[getGetAreaRoot200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/areas`, async ({ request }) => {
    const url = new URL(request.url);
    const areaCodes = url.searchParams.getAll('area_codes') ?? [];

    const selectedAreaData = getMockSelectedAreaData(areaCodes);
    if (selectedAreaData.length === 0) {
      return HttpResponse.json(
        { error: 'No area data found for selected areas' },
        { status: 404 }
      );
    }
    return HttpResponse.json(selectedAreaData, { status: 200 });
  }),
  http.get(`${baseURL}/indicators`, async () => {
    const resultArray = [[getFilterIndicators200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/indicators/:indicatorId`, async ({ params }) => {
    const indicatorId = params.indicatorId;
    if (
      typeof indicatorId === 'string' &&
      indicatorId.startsWith(ErrorIdPrefix)
    ) {
      return HttpResponse.json(
        { error: `ERROR Scenario ${params.indicatorId}` },
        { status: 500 }
      );
    }

    const resultArray = [[getGetIndicator200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(
    `${baseURL}/indicators/:indicatorId/data`,
    async ({ params, request }) => {
      const indicatorId = params.indicatorId;
      const url = new URL(request.url);
      const areaCodes = url.searchParams.getAll('area_codes');

      if (typeof indicatorId !== 'string') {
        return HttpResponse.json(getGetHealthDataForAnIndicator400Response(), {
          status: 400,
        });
      }
      const resultArray = [
        [
          getGetHealthDataForAnIndicator200Response(indicatorId, areaCodes),
          { status: 200 },
        ],
      ];

      return HttpResponse.json(...resultArray[next() % resultArray.length]);
    }
  ),

  http.post(`${baseURL}/indicators/:indicatorId/data`, async () => {
    const resultArray = [
      [getPostIndicatorsIndicatorIdData202Response(), { status: 202 }],
      [getPostIndicatorsIndicatorIdData400Response(), { status: 400 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  http.delete(`${baseURL}/indicators/:indicatorId/data`, async () => {
    const resultArray = [
      [getDeleteIndicatorsIndicatorIdData501Response(), { status: 501 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  http.delete(`${baseURL}/indicators/:indicatorId/batch/:batchId`, async () => {
    const resultArray = [
      [deleteUnpublishedData204Response(), { status: 204 }],
      [getGetIndicator404Response(), { status: 404 }],
      [getPostIndicatorsIndicatorIdData400Response(), { status: 400 }],
      [getGetIndicator500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  http.get(`${baseURL}/healthcheck`, async () => {
    console.log('HEALTHCHECK');
    const resultArray = [[getGetHealthcheck200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  //

  http.get(`${baseURL}/indicators/quartiles`, async () => {
    const resultArray = [
      [getGetIndicatorsQuartiles200Response(), { status: 200 }],
      [getGetIndicatorsQuartiles400Response(), { status: 400 }],
      [getGetIndicatorsQuartiles500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/indicators/quartiles/all`, async () => {
    const resultArray = [
      [getGetIndicatorsQuartilesAll200Response(), { status: 200 }],
      [getGetIndicatorsQuartilesAll400Response(), { status: 400 }],
      [getGetIndicatorsQuartilesAll500Response(), { status: 500 }],
    ];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),

  http.get(`${baseURL}/batches`, async () => {
    const resultArray = [
      [mockBatch(), { status: 200 }],
      [getGetIndicator500Response(), { status: 500 }],
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
  return allAreaTypes;
}

export function getGetAreaTypeMembers200Response(areaTypeKey: AreaTypeKeys) {
  return mockAvailableAreas[areaTypeKey];
}

export function getGetArea200Response(
  areaCode: string,
  includeChildren: string,
  childAreaType: string
): AreaWithRelations {
  const mockDataForArea = mockAreaData[areaCode];

  if (includeChildren === 'true') {
    const filteredChildrenByType = mockDataForArea.children?.filter((area) => {
      return area.areaType.key === childAreaType;
    });

    return {
      ...mockDataForArea,
      children: filteredChildrenByType,
    };
  }

  return mockDataForArea;
}

export function getGetAreaRoot200Response() {
  return {
    code: 'E92000001',
    name: 'England',
  };
}

export function getGetHealthcheck200Response() {
  return { status: 'Healthy' };
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

export function getGetHealthDataForAnIndicator200Response(
  indicatorId: string,
  areaCodes: string[]
): IndicatorWithHealthDataForArea {
  const healthDataForAreas: HealthDataForArea[] = areaCodes.map((areaCode) =>
    mockHealthDataForArea({
      areaCode: areaCode,
      areaName: areaCode,
      healthData: mockHealthDataPoints([
        { datePeriod: mockDatePeriod(2020), value: 10 },
        { datePeriod: mockDatePeriod(2021), value: 9 },
        { datePeriod: mockDatePeriod(2022), value: 8 },
      ]),
    })
  );
  return mockIndicatorWithHealthDataForArea({
    indicatorId: Number(indicatorId),
    areaHealthData: healthDataForAreas,
  });
}

export function getGetHealthDataForAnIndicator500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getPostIndicatorsIndicatorIdData202Response() {
  return {
    message: 'Data processing started successfully',
  };
}

export function getPostIndicatorsIndicatorIdData400Response() {
  return getGetIndicator404Response();
}

export function getDeleteIndicatorsIndicatorIdData501Response() {
  return null;
}

export function deleteUnpublishedData204Response() {
  return { status: 204 };
}

function getMockSelectedAreaData(areaCodes: string[]) {
  const mockDataForAreas: Area[] = [];

  areaCodes.forEach((areaCode) => {
    if (mockAreaData[areaCode]) {
      mockDataForAreas.push(mockAreaData[areaCode] as Area);
    }
  });

  return mockDataForAreas.filter(
    (mockArea) => !mockArea.code.toLowerCase().includes('error')
  );
}

export function getGetIndicatorsQuartiles200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => ({
    indicatorId: 21404,
    age: {
      value: '0-4',
      isAggregate: faker.datatype.boolean(),
    },
    sex: {
      value: 'Female',
      isAggregate: faker.datatype.boolean(),
    },
    isAggregate: faker.datatype.boolean(),
    year: 2023,
    datePeriod: {
      type: 'Calendar',
      from: '2023-12-31',
      to: '2023-12-31',
    },
    polarity: faker.helpers.arrayElement([
      'Unknown',
      'NoJudgement',
      'LowIsGood',
      'HighIsGood',
    ]),
    frequency: 'Annually',
    q0Value: faker.number.int(),
    q1Value: faker.number.int(),
    q2Value: faker.number.int(),
    q3Value: faker.number.int(),
    q4Value: faker.number.int(),
    areaValue: faker.number.int(),
    ancestorValue: faker.number.int(),
    englandValue: faker.number.int(),
  }));
}

export function getGetIndicatorsQuartiles400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetIndicatorsQuartiles500Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetIndicatorsQuartilesAll200Response() {
  return [
    ...new Array(faker.number.int({ min: 1, max: MAX_ARRAY_LENGTH })).keys(),
  ].map((_) => ({
    indicatorId: 21404,
    age: {
      value: '0-4',
      isAggregate: faker.datatype.boolean(),
    },
    sex: {
      value: 'Female',
      isAggregate: faker.datatype.boolean(),
    },
    isAggregate: faker.datatype.boolean(),
    year: 2023,
    datePeriod: {
      type: 'Calendar',
      from: '2023-12-31',
      to: '2023-12-31',
    },
    polarity: faker.helpers.arrayElement([
      'Unknown',
      'NoJudgement',
      'LowIsGood',
      'HighIsGood',
    ]),
    frequency: 'Annually',
    q0Value: faker.number.int(),
    q1Value: faker.number.int(),
    q2Value: faker.number.int(),
    q3Value: faker.number.int(),
    q4Value: faker.number.int(),
    areaValue: faker.number.int(),
    ancestorValue: faker.number.int(),
    englandValue: faker.number.int(),
  }));
}

export function getGetIndicatorsQuartilesAll400Response() {
  return {
    message: faker.lorem.words(),
  };
}

export function getGetIndicatorsQuartilesAll500Response() {
  return {
    message: faker.lorem.words(),
  };
}
