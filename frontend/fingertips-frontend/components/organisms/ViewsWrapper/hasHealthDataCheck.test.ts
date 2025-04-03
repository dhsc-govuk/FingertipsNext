import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { hasHealthDataCheck } from './hasHealthDataCheck';

export const generateMockAreaHealthData = (
  areaCode: string
): HealthDataForArea => {
  return {
    areaCode,
    areaName: `Name ${areaCode}`,
    healthData: [],
  };
};

export const generateMockIndicatorWithAreaHealthData = (
  indicatorId: number,
  areaHealthData: HealthDataForArea[]
): IndicatorWithHealthDataForArea => {
  return {
    indicatorId,
    areaHealthData,
  };
};

describe('hasHealthDataCheck', () => {
  describe('When there is only one indicator', () => {
    it('should return true if the indicator has health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return false if the indicator has no health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, []),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return true if the indicator has health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
          generateMockAreaHealthData('A002'),
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return true if the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return false if the indicator has no health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });
  });

  describe('When there are multiple indicators', () => {
    it('should return true if all the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return true if one of the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return false if all the indicator has no health data for all of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A003'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });
  });
});
