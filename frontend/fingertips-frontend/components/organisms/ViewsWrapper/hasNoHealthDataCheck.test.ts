import {
  HealthDataForArea,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { hasNoHealthDataCheck } from './hasNoHealthDataCheck';

const generateMockAreaHealthData = (areaCode: string): HealthDataForArea => {
  return {
    areaCode,
    areaName: `Name ${areaCode}`,
    healthData: [],
  };
};

const generateMockIndicatorWithAreaHealthData = (
  indicatorId: number,
  areaHealthData: HealthDataForArea[]
): IndicatorWithHealthDataForArea => {
  return {
    indicatorId,
    areaHealthData,
  };
};

describe('hasNoHealthDataCheck', () => {
  describe('When there is only one indicator', () => {
    it('should return false if the indicator has health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return true if the indicator has no health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, []),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });

    it('should return false if the indicator has health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
          generateMockAreaHealthData('A002'),
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return false if the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return true if the indicator has no health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });
  });

  describe('When there are multiple indicators', () => {
    it('should return false if all the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return false if one of the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(false);
    });

    it('should return true if all the indicator has no health data for all of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A003'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A003'),
        ]),
      ];

      const result = hasNoHealthDataCheck(indicatorsToCheck, areasSelected);

      expect(result).toBe(true);
    });
  });
});
