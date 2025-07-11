import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';

describe('singleIndicatorBasicTableData', () => {
  it('returns BasicTableData[] from valid input', () => {
    const testIndicator = mockIndicatorDocument();
    const {
      indicatorName,
      indicatorID: indicatorId,
      unitLabel,
    } = testIndicator;

    const testArea = mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({ sex: mockSexData({ value: 'Female' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Persons' }) }),
        mockIndicatorSegment({ sex: mockSexData({ value: 'Male' }) }),
      ],
    });

    const result = singleIndicatorBasicTableData(testArea, testIndicator);

    const baseExpectedRow = {
      areaCode: 'E06000015',
      areaName: 'Derby',
      count: 5195,
      indicatorId: Number(indicatorId),
      indicatorName,
      period: '2023',
      trend: 'Cannot be calculated',
      unitLabel,
      value: 18.1,
    };

    expect(result).toEqual([
      { ...baseExpectedRow, indicatorName: `${indicatorName} (Persons)` },
      { ...baseExpectedRow, indicatorName: `${indicatorName} (Male)` },
      { ...baseExpectedRow, indicatorName: `${indicatorName} (Female)` },
    ]);
  });

  it('returns null if indicatorSegments is missing', () => {
    const area = mockHealthDataForArea({ indicatorSegments: undefined });

    const result = singleIndicatorBasicTableData(area, mockIndicatorDocument());

    expect(result).toEqual([]);
  });
});
