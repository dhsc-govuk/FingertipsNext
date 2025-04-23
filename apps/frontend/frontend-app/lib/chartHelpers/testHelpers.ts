import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { healthDataPoint } from '../mocks';

export const generateHealthDataPoint = (
  year: number,
  sexIsAggregate: boolean,
  deprivationIsAggregate: boolean
): HealthDataPoint => {
  return {
    ...healthDataPoint,
    year,
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
