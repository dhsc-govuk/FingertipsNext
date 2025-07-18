import { findHealthDataForArea } from '@/lib/healthDataHelpers/findHealthDataForArea';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const testIndicator = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea(),
    mockHealthDataForArea_Group(),
    mockHealthDataForArea_England(),
  ],
});

describe('findHealthDataForArea', () => {
  it('returns undefined if there is no area health data', () => {
    expect(
      findHealthDataForArea({} as IndicatorWithHealthDataForArea, 'A12345')
    ).toBeUndefined();
  });

  it('returns undefined if the areaHealthData does not contain an item for the requested area code', () => {
    expect(findHealthDataForArea(testIndicator, 'A12345')).toBeUndefined();
  });

  it('gets the relevant health data item based on the requested area code', () => {
    expect(findHealthDataForArea(testIndicator, areaCodeForEngland)).toBe(
      testIndicator?.areaHealthData?.at(2)
    );
  });
});
