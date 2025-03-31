import {
  AgeData,
  DeprivationData,
  HealthDataPoint,
  HealthDataPointTrendEnum,
  SexData,
} from '@/generated-sources/ft-api-client';

export const noDeprivation: DeprivationData = {
  sequence: 1,
  type: 'All',
  value: 'All',
  isAggregate: true,
};

export const personsSex: SexData = {
  value: 'Persons',
  isAggregate: true,
};

export const maleSex: SexData = {
  value: 'Male',
  isAggregate: false,
};

export const femaleSex: SexData = {
  value: 'Female',
  isAggregate: false,
};

export const allAgesAge: AgeData = {
  value: 'All ages',
  isAggregate: true,
};

export const disaggregatedAge = (age: string) => {
  return {
    value: age,
    isAggregate: false,
  };
};

export const healthDataPoint: HealthDataPoint = {
  count: 389,
  lowerCi: 441.69151,
  upperCi: 578.32766,
  value: 278.29134,
  year: 2006,
  sex: personsSex,
  ageBand: allAgesAge,
  trend: HealthDataPointTrendEnum.NotYetCalculated,
  deprivation: noDeprivation,
};
