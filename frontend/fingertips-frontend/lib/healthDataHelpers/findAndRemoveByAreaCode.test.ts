import { findAndRemoveByAreaCode } from '@/lib/healthDataHelpers/findAndRemoveByAreaCode';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { expectAnyHealthDataForArea } from '@/mock/data/expectAnyHealthDataForArea';

describe('findAndRemoveByAreaCode', () => {
  const mockData: HealthDataForArea[] = [
    mockHealthDataForArea({ areaCode: 'A1' }),
    mockHealthDataForArea({ areaCode: 'B2' }),
    mockHealthDataForArea({ areaCode: 'C3' }),
  ];

  it('removes and returns the matching area when found', () => {
    const [remaining, found] = findAndRemoveByAreaCode(mockData, 'B2');

    expect(found).toEqual(expectAnyHealthDataForArea({ areaCode: 'B2' }));
    expect(remaining).toEqual([
      expectAnyHealthDataForArea({ areaCode: 'A1' }),
      expectAnyHealthDataForArea({ areaCode: 'C3' }),
    ]);
  });

  it('returns the original array and undefined if areaCode not found', () => {
    const [remaining, found] = findAndRemoveByAreaCode(mockData, 'Z9');

    expect(found).toBeUndefined();
    expect(remaining).toEqual(mockData);
  });

  it('returns the original array and undefined if areaCode is undefined', () => {
    const [remaining, found] = findAndRemoveByAreaCode(mockData, undefined);

    expect(found).toBeUndefined();
    expect(remaining).toEqual(mockData);
  });
});
