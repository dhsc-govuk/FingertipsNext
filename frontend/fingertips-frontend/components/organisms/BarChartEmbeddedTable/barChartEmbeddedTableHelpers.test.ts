import {
  filterUndefined,
  getFirstCompleteYear,
  getMaxValue,
} from '@/components/organisms/BarChartEmbeddedTable/barChartEmbeddedTableHelpers';
import { HealthDataForArea } from '@/generated-sources/ft-api-client';

const getTestArea = (values: (number | undefined)[]) => {
  return {
    healthData: values.map((value) => ({ value, year: value })),
  } as HealthDataForArea;
};

describe('BarChartEmbeddedTableHelpers', () => {
  describe('filterUndefined', () => {
    it('should remove all undefined items from array', () => {
      expect(['a', 'b', undefined, 'd'].filter(filterUndefined)).toEqual([
        'a',
        'b',
        'd',
      ]);
    });
  });

  describe('getMaxValue', () => {
    it('should loop over area and health points and return the max value from all of them', () => {
      const testArea1 = getTestArea([1, 2, 4, 8, 16, undefined]);
      const testArea2 = getTestArea([16, 43, 12]);
      const testArea3 = getTestArea([4, 8, 15, 16, 23, 42]);
      expect(getMaxValue([testArea1, testArea2, testArea3])).toEqual(43);
    });
  });

  describe('getFirstCompleteYear', () => {
    it('should find the first complete year', () => {
      const testArea1 = getTestArea([2021, 2022, 2023, undefined]);
      const testArea2 = getTestArea([2022, 2023, 2024]);
      const testArea3 = getTestArea([2019, 2022, 2023, 2024, 2025]);
      expect(
        getFirstCompleteYear([testArea1, testArea2, testArea3], undefined, undefined)
      ).toEqual(2023);
    });
  });
});
