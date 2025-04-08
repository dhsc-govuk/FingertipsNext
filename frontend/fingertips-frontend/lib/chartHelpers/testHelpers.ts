import {
  HealthDataForArea,
  HealthDataPoint,
} from '@/generated-sources/ft-api-client';
import { healthDataPoint } from '../mocks';

export const generateHealthDataPoint = (
  year: number,
  isAggregate: boolean
): HealthDataPoint => {
  return {
    ...healthDataPoint,
    year,
    sex: {
      value: 'male',
      isAggregate,
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
