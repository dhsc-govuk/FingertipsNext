import { extractingCombinedHealthData } from './extractHealthDataForArea';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';

const mockAreaCode = 'A001';
const mockGroupCode = 'G001';

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

describe('extractingCombinedHealthData', () => {
  it('empty data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {};

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing health data for indicator');
  });

  it('wrong area id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing health data for indicator');
  });

  it('missing group data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing group health data for indicator');
  });

  it('wrong group id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing group health data for indicator');
  });

  it('missing England data should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockGroupData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing England health data for indicator');
  });

  it('wrong England id should raise an error', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockGroupData, mockOtherData],
    };

    expect(() => {
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      );
    }).toThrow('Missing England health data for indicator');
  });

  it('valid data return separated data', () => {
    const indicatorData: IndicatorWithHealthDataForArea = {
      areaHealthData: [mockAreaData, mockGroupData, mockEnglandData],
    };

    const expectedResult = {
      englandIndicatorData: [
        { areaCode: 'E92000001', areaName: 'england', healthData: [] },
      ],
      groupIndicatorData: [
        { areaCode: 'G001', areaName: 'group', healthData: [] },
      ],
      healthIndicatorData: [
        { areaCode: 'A001', areaName: 'area', healthData: [] },
      ],
    };

    expect(
      extractingCombinedHealthData(
        [indicatorData],
        [mockAreaCode],
        mockGroupCode
      )
    ).toStrictEqual(expectedResult);
  });
});
