import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  getDynamicKeys,
  getYearDataGroupedByInequalities,
  groupHealthDataByInequalities,
  groupHealthDataByYear,
  Inequalities,
  shouldDisplayInequalities,
} from './inequalitiesHelpers';

const MOCK_HEALTH_DATA: HealthDataForArea = {
  areaCode: 'A1425',
  areaName: 'North FooBar',
  healthData: [
    {
      count: 389,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      value: 278.29134,
      year: 2006,
      sex: 'All',
      ageBand: 'All',
    },
    {
      count: 400,
      lowerCi: 443.453,
      upperCi: 470.45543,
      value: 450.5343,
      year: 2006,
      sex: 'Male',
      ageBand: 'All',
    },
    {
      count: 267,
      lowerCi: 441.69151,
      upperCi: 578.32766,
      value: 703.420759,
      year: 2004,
      sex: 'All',
      ageBand: 'All',
    },
    {
      count: 300,
      lowerCi: 345.4543,
      upperCi: 400.34234,
      value: 370.34334,
      year: 2004,
      sex: 'Female',
      ageBand: 'All',
    },
  ],
};

const yearlyHealthDataGroupedBySex = {
  2004: {
    All: [MOCK_HEALTH_DATA.healthData[2]],
    Female: [MOCK_HEALTH_DATA.healthData[3]],
  },
  2006: {
    All: [MOCK_HEALTH_DATA.healthData[0]],
    Male: [MOCK_HEALTH_DATA.healthData[1]],
  },
};

describe('should display inequalities', () => {
  describe('should return false', () => {
    it('should return false when multiple indicators are selected', () => {
      expect(shouldDisplayInequalities(['1', '108'], ['A1'])).toBe(false);
    });

    it('should return false when multiple areas are selected', () => {
      expect(shouldDisplayInequalities(['1'], ['A1', 'A2'])).toBe(false);
    });
  });

  describe('should return true', () => {
    it('should return true when a single indicator is selected with a single area', () => {
      expect(shouldDisplayInequalities(['1'], ['A1'])).toBe(true);
    });
  });
});

describe('groupHealthDataByYear', () => {
  it('should group health data by year', () => {
    const healthDataGroupedByYear = {
      2004: [MOCK_HEALTH_DATA.healthData[2], MOCK_HEALTH_DATA.healthData[3]],
      2006: [MOCK_HEALTH_DATA.healthData[0], MOCK_HEALTH_DATA.healthData[1]],
    };

    expect(groupHealthDataByYear(MOCK_HEALTH_DATA.healthData)).toEqual(
      healthDataGroupedByYear
    );
  });
});

describe('groupHealthDataByInequalities', () => {
  it('should group health data by sex', () => {
    const healthDataGroupedBySex = {
      All: [MOCK_HEALTH_DATA.healthData[0], MOCK_HEALTH_DATA.healthData[2]],
      Male: [MOCK_HEALTH_DATA.healthData[1]],
      Female: [MOCK_HEALTH_DATA.healthData[3]],
    };

    expect(groupHealthDataByInequalities(MOCK_HEALTH_DATA.healthData)).toEqual(
      healthDataGroupedBySex
    );
  });
});

describe('getYearDataGroupedByInequalities', () => {
  it('should group year data by sex', () => {
    expect(
      getYearDataGroupedByInequalities(
        groupHealthDataByYear(MOCK_HEALTH_DATA.healthData)
      )
    ).toEqual(yearlyHealthDataGroupedBySex);
  });
});

describe('getDynamicKeys', () => {
  it('should get unique keys for sex inequality sorted', () => {
    const expectedKeys = ['Persons', 'Male', 'Female'];

    expect(
      getDynamicKeys(yearlyHealthDataGroupedBySex, Inequalities.Sex)
    ).toEqual(expectedKeys);
  });

  it('should get unique keys for inequality unsorted', () => {
    const expectedKeys = ['All', 'Female', 'Male'];

    expect(
      getDynamicKeys(yearlyHealthDataGroupedBySex, Inequalities.Decile)
    ).toEqual(expectedKeys);
  });
});
