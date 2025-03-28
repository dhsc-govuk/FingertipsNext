import { extractingCombinedHealthData } from './extractHealthDataForArea';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

const mockAreaCode = 'A001';
const mockGroupCode = 'G001';
const mockIndicatorId = 1;

const mockAreaData: HealthDataForArea = {
  areaCode: mockAreaCode,
  areaName: 'area',
  healthData: [],
};

const mockGroupData: HealthDataForArea = {
  areaCode: mockGroupCode,
  areaName: 'group',
  healthData: [],
};

const mockEnglandData: HealthDataForArea = {
  areaCode: areaCodeForEngland,
  areaName: 'england',
  healthData: [],
};

const mockOtherData: HealthDataForArea = {
  areaCode: 'X001',
  areaName: 'other',
  healthData: [],
};

const mockValidMetaData = [
  {
    indicatorID: String(mockIndicatorId),
    indicatorName: 'pancakes eaten',
    indicatorDefinition: 'number of pancakes consumed',
    dataSource: 'BJSS Leeds',
    earliestDataPeriod: '2025',
    latestDataPeriod: '2025',
    lastUpdatedDate: new Date('March 4, 2025'),
    associatedAreaCodes: [mockAreaCode],
    unitLabel: 'pancakes',
    hasInequalities: true,
    usedInPoc: false,
  },
];

const mockInvalidMetaData = [
  {
    indicatorID: '1337',
    indicatorName: 'pizzas eaten',
    indicatorDefinition: 'number of pizzas consumed',
    dataSource: 'BJSS Leeds',
    earliestDataPeriod: '2023',
    latestDataPeriod: '2023',
    lastUpdatedDate: new Date('March 4, 2023'),
    associatedAreaCodes: [mockAreaCode],
    unitLabel: 'pizzas',
    hasInequalities: true,
    usedInPoc: false,
  },
];

describe('extractingCombinedHealthData', () => {
  it('empty data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {};

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        mockValidMetaData,
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing health data for indicator');
  });

  it('wrong area id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing area health data for indicator');
  });

  it('missing group data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing group health data for indicator');
  });

  it('wrong group id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing group health data for indicator');
  });

  it('missing England data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing England health data for indicator');
  });

  it('wrong England id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing England health data for indicator');
  });

  it('missing metadata should pass', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    const expectedResult = {
      orderedEnglandData: [
        { areaCode: 'E92000001', areaName: 'england', healthData: [] },
      ],
      orderedGroupData: [
        { areaCode: 'G001', areaName: 'group', healthData: [] },
      ],
      orderedHealthData: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedMetadata: [undefined],
    };

    expect(
      extractingCombinedHealthData(
        [indicatorData],
        [],
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });

  it('missing indicator ID should pass', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    const expectedResult = {
      orderedEnglandData: [
        { areaCode: 'E92000001', areaName: 'england', healthData: [] },
      ],
      orderedGroupData: [
        { areaCode: 'G001', areaName: 'group', healthData: [] },
      ],
      orderedHealthData: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedMetadata: [undefined],
    };

    expect(
      extractingCombinedHealthData(
        [indicatorData],
        mockValidMetaData,
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });

  it('no matching metadata should pass', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    const expectedResult = {
      orderedEnglandData: [
        { areaCode: 'E92000001', areaName: 'england', healthData: [] },
      ],
      orderedGroupData: [
        { areaCode: 'G001', areaName: 'group', healthData: [] },
      ],
      orderedHealthData: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedMetadata: [undefined],
    };

    expect(
      extractingCombinedHealthData(
        [indicatorData],
        mockInvalidMetaData,
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });

  it('valid data return separated data', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    const expectedResult = {
      orderedEnglandData: [
        { areaCode: 'E92000001', areaName: 'england', healthData: [] },
      ],
      orderedGroupData: [
        { areaCode: 'G001', areaName: 'group', healthData: [] },
      ],
      orderedHealthData: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedMetadata: [undefined],
    };

    expect(
      extractingCombinedHealthData(
        [indicatorData],
        mockValidMetaData,
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });
});
