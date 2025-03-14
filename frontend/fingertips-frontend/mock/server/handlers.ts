import { HttpResponse, http } from 'msw';
import { faker } from '@faker-js/faker';
import { mockHealthData } from '@/mock/data/healthdata';
import { mockAreaData, mockAvailableAreas } from '../data/areaData';
import {
  allAreaTypes,
  AreaTypeKeys,
} from '../../lib/areaFilterHelpers/areaType';
import { AreaWithRelations } from '@/generated-sources/ft-api-client';

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

    if (areaCode.startsWith('ERROR')) {
      return HttpResponse.json({ error: `ERROR Scenario ${areaCode}` }, { status: 500 });
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
  http.get(`${baseURL}/indicators`, async () => {
    const resultArray = [[getFilterIndicators200Response(), { status: 200 }]];

    return HttpResponse.json(...resultArray[next() % resultArray.length]);
  }),
  http.get(`${baseURL}/indicators/:indicatorId`, async ({ params }) => {
    const indicatorId = params.indicatorId;
    if (typeof indicatorId === 'string' && indicatorId.startsWith('ERROR')) {
      return HttpResponse.json({ error: `ERROR Scenario ${params.indicatorId}` }, { status: 500 });
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
  http.get(`${baseURL}/healthcheck`, async () => {
    const resultArray = [[getGetHealthcheck200Response(), { status: 200 }]];

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
) {
  let healthDataForIndicator = mockHealthData[1];

  if (indicatorId in mockHealthData) {
    healthDataForIndicator = mockHealthData[indicatorId];
  }

  const healthDataForArea = healthDataForIndicator.filter((healthData) =>
    areaCodes.includes(healthData.areaCode)
  );
  return !isAreaCodesEmpty(areaCodes)
    ? healthDataForArea
    : healthDataForIndicator;
}

function isAreaCodesEmpty(areaCodes: string[]) {
  return !areaCodes.length || (areaCodes.length === 1 && areaCodes[0] === '');
}
