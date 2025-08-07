import { healthDataPoint } from '../mocks';
import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

export const generateHealthDataPoint = (
  year: number,
  sexIsAggregate: boolean,
  deprivationIsAggregate: boolean
): HealthDataPoint => {
  return {
    ...healthDataPoint,
    periodLabel: `${year}`,
    datePeriod: mockDatePeriod(year),
    sex: {
      value: 'male',
      isAggregate: sexIsAggregate,
    },
    deprivation: {
      sequence: 1,
      value: 'some value',
      type: 'some type',
      isAggregate: deprivationIsAggregate,
    },
  };
};

export const generateMockHealthDataForArea = (
  areaCode: string,
  healthData: HealthDataPoint[]
): HealthDataForArea => {
  return {
    areaCode,
    areaName: `some name for ${areaCode}`,
    healthData,
  };
};
