import { extractCombinedHealthData } from './spineChartTableHelpers';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  HealthDataForArea,
  IndicatorPolarity,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

const mockAreaCode = 'A001';
const mockGroupCode = 'G001';
const mockIndicatorId = 1;
const mockInvalidIndicatorId = 1337;

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
    indicatorID: String(mockInvalidIndicatorId),
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

const mockQuartileData = [
  {
    indicatorId: mockIndicatorId,
    polarity: IndicatorPolarity.LowIsGood,
    q0Value: 1,
    q1Value: 2,
    q2Value: 3,
    q3Value: 4,
    q4Value: 5,
    areaValue: 6,
    ancestorValue: 7,
    englandValue: 8,
  },
];

const mockInvalidQuartileData = [
  {
    indicatorId: mockInvalidIndicatorId,
    polarity: IndicatorPolarity.LowIsGood,
    q0Value: 1,
    q1Value: 2,
    q2Value: 3,
    q3Value: 4,
    q4Value: 5,
    areaValue: 6,
    ancestorValue: 7,
    englandValue: 8,
  },
];

describe('extractCombinedHealthData ', () => {
  it('empty data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {};

    expect(() => {
      extractCombinedHealthData(
        [indicatorData],
        [],
        [],
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
      extractCombinedHealthData(
        [indicatorData],
        [],
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
      extractCombinedHealthData(
        [indicatorData],
        [],
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
      extractCombinedHealthData(
        [indicatorData],
        [],
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
      extractCombinedHealthData(
        [indicatorData],
        [],
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
      extractCombinedHealthData(
        [indicatorData],
        [],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing England health data for indicator');
  });

  it('missing quartile data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    expect(() => {
      extractCombinedHealthData(
        [indicatorData],
        [],
        [],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing quartile data for indicator');
  });

  it('mismatched quartile data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      indicatorId: mockIndicatorId,
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    expect(() => {
      extractCombinedHealthData(
        [indicatorData],
        [],
        mockInvalidQuartileData,
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing quartile data for indicator');
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
      orderedHealthDataAreaOne: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedHealthDataAreaTwo: undefined,
      orderedMetadata: [undefined],
      orderedQuartileData: mockQuartileData,
    };

    expect(
      extractCombinedHealthData(
        [indicatorData],
        [],
        mockQuartileData,
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });

  it('missing indicator ID should fail', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    expect(() => {
      extractCombinedHealthData(
        [indicatorData],
        mockValidMetaData,
        mockQuartileData,
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing quartile data for indicator');
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
      orderedHealthDataAreaOne: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedHealthDataAreaTwo: undefined,
      orderedMetadata: [undefined],
      orderedQuartileData: mockQuartileData,
    };

    expect(
      extractCombinedHealthData(
        [indicatorData],
        mockInvalidMetaData,
        mockQuartileData,
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
      orderedHealthDataAreaOne: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
      orderedHealthDataAreaTwo: undefined,
      orderedMetadata: mockValidMetaData,
      orderedQuartileData: mockQuartileData,
    };

    expect(
      extractCombinedHealthData(
        [indicatorData],
        mockValidMetaData,
        mockQuartileData,
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });
});
