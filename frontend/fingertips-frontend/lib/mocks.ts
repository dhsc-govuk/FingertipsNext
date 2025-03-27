import {
  AgeData,
  DeprivationData,
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
