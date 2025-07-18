import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';
import { IndicatorWithHealthDataForArea } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { findHealthDataForAreas } from '@/lib/healthDataHelpers/findHealthDataForAreas';

const testIndicator = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea(),
    mockHealthDataForArea_Group(),
    mockHealthDataForArea_England(),
  ],
});

describe('findHealthDataForAreas', () => {
  it('returns [] if there is no area health data', () => {
    expect(
      findHealthDataForAreas({} as IndicatorWithHealthDataForArea, ['A12345'])
    ).toEqual([]);
  });

  it('returns [] if the areaHealthData does not contain an item for the requested area codes', () => {
    expect(findHealthDataForAreas(testIndicator, ['A123', 'B456'])).toEqual([]);
  });

  it('gets the relevant health data items based on the requested area codes', () => {
    expect(
      findHealthDataForAreas(testIndicator, [
        testIndicator?.areaHealthData?.at(1)?.areaCode ?? '',
        areaCodeForEngland,
      ])
    ).toEqual([
      testIndicator?.areaHealthData?.at(1),
      testIndicator?.areaHealthData?.at(2),
    ]);
  });
});
