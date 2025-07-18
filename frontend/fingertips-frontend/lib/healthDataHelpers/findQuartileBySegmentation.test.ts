import { mockQuartileData } from '@/mock/data/mockQuartileData';
import { mockSexData } from '@/mock/data/mockSexData';
import { mockAgeData } from '@/mock/data/mockAgeData';
import { QuartileData } from '@/generated-sources/ft-api-client';
import { findQuartileBySegmentation } from '@/lib/healthDataHelpers/findQuartileBySegmentation';
import { SegmentInfo } from '@/lib/common-types';

// creating test quartiles for all combinations of 3 ids, 4 sexes and 4 ages
// 2 of the sexes and ages are equivalent to selecting the aggregate
const testQuartiles: QuartileData[] = [];
const testSegments: Record<string, string | number>[] = [];
const ids = [1, 2, 3];
const sexes = [undefined, 'Persons', 'Male', 'Female'];
const ages = [undefined, 'All ages', 'Young', 'Old'];

ids.forEach((id) => {
  sexes.forEach((sex) => {
    ages.forEach((age) => {
      const segment = { sex: sex ?? '', age: age ?? '', frequency: '' };

      const overrides: Partial<QuartileData> = { indicatorId: id };
      if (sex) {
        overrides.sex = mockSexData({
          value: sex,
          isAggregate: !sex || sex === 'Persons',
        });
      }
      if (age) {
        overrides.age = mockAgeData({
          value: age,
          isAggregate: !age || age === 'All ages',
        });
      }

      testQuartiles.push(mockQuartileData(overrides));
      testSegments.push({ ...segment, id });
    });
  });
});

describe('findQuartileBySegmentation', () => {
  it('should return undefined if there is no quartile with the given indicatorId', () => {
    const { id: _, ...segment } = testSegments[0];
    expect(
      findQuartileBySegmentation(testQuartiles, 123, segment as SegmentInfo)
    ).toBeUndefined();
  });

  it('should return undefined if there is no quartile with the supplied segment info', () => {
    const segment: SegmentInfo = {
      sex: 'Male',
      age: 'Middle aged',
      frequency: '',
    };
    expect(
      findQuartileBySegmentation(testQuartiles, 2, segment)
    ).toBeUndefined();
  });

  it.each(testSegments)(
    "should find each quartile based on it's segment info %s",
    (testData) => {
      const { id, ...segment } = testData;
      const testIndex = testSegments.indexOf(testData);
      const result = findQuartileBySegmentation(
        testQuartiles,
        id as number,
        segment as SegmentInfo
      );

      expect(result).toEqual(testQuartiles.at(testIndex));
    }
  );
});
