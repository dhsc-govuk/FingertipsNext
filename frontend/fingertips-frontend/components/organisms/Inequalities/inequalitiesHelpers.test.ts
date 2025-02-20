import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import {
  groupHealthDataByYear,
  shouldDisplayInequalities,
} from './inequalitiesHelpers';

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
          sex: 'Persons',
          ageBand: 'All',
        },
        {
          count: 267,
          lowerCi: 441.69151,
          upperCi: 578.32766,
          value: 703.420759,
          year: 2004,
          sex: 'Persons',
          ageBand: 'All',
        },
      ],
    };

    const healthDataGroupedByYear = {
      2004: [MOCK_HEALTH_DATA.healthData[1]],
      2006: [MOCK_HEALTH_DATA.healthData[0]],
    };

    expect(groupHealthDataByYear(MOCK_HEALTH_DATA.healthData)).toEqual(
      healthDataGroupedByYear
    );
  });
});
