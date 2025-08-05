import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { segmentName } from '@/lib/healthDataHelpers/segmentName';

describe('segmentName', () => {
  it('should return a name for the segment', () => {
    expect(segmentName(mockIndicatorSegment())).toEqual(
      'Persons, All ages, Yearly'
    );
  });
});
