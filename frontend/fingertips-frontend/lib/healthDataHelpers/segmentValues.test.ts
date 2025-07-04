import { segmentValues } from '@/lib/healthDataHelpers/segmentValues';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';

const mockData = mockIndicatorWithHealthDataForArea({
  areaHealthData: [
    mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({ sex: { value: 'A', isAggregate: false } }),
        mockIndicatorSegment({ sex: { value: 'D', isAggregate: false } }),
        mockIndicatorSegment({ sex: { value: 'Agg', isAggregate: true } }),
        mockIndicatorSegment({ sex: { value: 'B', isAggregate: false } }),
        mockIndicatorSegment({ sex: { value: 'C', isAggregate: false } }),
      ],
    }),
  ],
});

describe('segmentDropDownOptions', () => {
  it('should find the segmentation options available for sex and reverse the order', () => {
    const result = segmentValues(mockData);

    expect(result.sex).toEqual(['Agg', 'D', 'C', 'B', 'A']);
  });
});
