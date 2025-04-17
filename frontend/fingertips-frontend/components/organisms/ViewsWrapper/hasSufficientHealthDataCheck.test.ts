import {
  HealthDataForArea,
  HealthDataPoint,
  HealthDataPointTrendEnum,
  IndicatorWithHealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { hasSufficientHealthDataCheck } from './hasSufficientHealthDataCheck';

export const generateMockHealthDataPoint = (year: number): HealthDataPoint => {
  return {
    year,
    ageBand: { value: '0-4', isAggregate: false },
    sex: { value: 'female', isAggregate: false },
    trend: HealthDataPointTrendEnum.IncreasingAndGettingBetter,
    deprivation: {
      sequence: 0,
      value: 'dep1',
      type: 'depType',
      isAggregate: false,
    },
  };
};

export const generateMockAreaHealthData = (
  areaCode: string,
  healthData: HealthDataPoint[] = []
): HealthDataForArea => {
  return {
    areaCode,
    areaName: `Name ${areaCode}`,
    healthData: healthData,
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

const sufficientMockHealthDataPoints = [
  generateMockHealthDataPoint(2022),
  generateMockHealthDataPoint(2021),
];

const insufficientMockHealthDataPoints = [generateMockHealthDataPoint(2022)];

describe('hasSufficientHealthDataCheck', () => {
  describe('When there is only one indicator', () => {
    it('should return true if the indicator has sufficient health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return false if the indicator has insufficient health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });

    it('should return true if indicator has insufficient health data for the areas selected but more than 2 areas are selected. Only the latest data health point is provided for more than 2 areas', () => {
      const areasSelected = ['A001', 'A002', 'A003'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A003', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return false if the indicator has no health data for the single areaSelected', () => {
      const areasSelected = ['A001'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, []),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });

    it('should return true if the indicator has sufficient health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', sufficientMockHealthDataPoints),
          generateMockAreaHealthData('A003', sufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return true if the indicator has sufficient health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return false if the indicator has no health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
          generateMockAreaHealthData('A002'),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });

    it('should return false if the indicator has insufficient health data for all the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });
  });

  describe('When there are multiple indicators', () => {
    it('should return true if all the indicator has sufficient health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return true if one of the indicator has health data for at least one of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', sufficientMockHealthDataPoints),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A003', sufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return true if one of the indicators and areasSelected has sufficient health data', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', sufficientMockHealthDataPoints),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(true);
    });

    it('should return false if all the indicator has no health data for all of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001'),
          generateMockAreaHealthData('A002'),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001'),
          generateMockAreaHealthData('A002'),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });

    it('should return false if all the indicator has insufficient health data for all of the areaSelected', () => {
      const areasSelected = ['A001', 'A002'];

      const indicatorsToCheck = [
        generateMockIndicatorWithAreaHealthData(1, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
        ]),
        generateMockIndicatorWithAreaHealthData(2, [
          generateMockAreaHealthData('A001', insufficientMockHealthDataPoints),
          generateMockAreaHealthData('A002', insufficientMockHealthDataPoints),
        ]),
      ];

      const result = hasSufficientHealthDataCheck(
        indicatorsToCheck,
        areasSelected
      );

      expect(result).toBe(false);
    });
  });
});
