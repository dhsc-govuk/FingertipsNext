import { singleIndicatorBasicTableData } from '@/components/charts/BasicTable/helpers/singleIndicatorBasicTableData';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorSegment } from '@/mock/data/mockIndicatorSegment';
import { mockSexData } from '@/mock/data/mockSexData';
import { Frequency, PeriodType } from '@/generated-sources/ft-api-client';
import { mockHealthDataPoint } from '@/mock/data/mockHealthDataPoint';
import { mockDatePeriod } from '@/mock/data/mockDatePeriod';

describe('singleIndicatorBasicTableData', () => {
  it('returns BasicTableData[] from valid input', () => {
    const testIndicator = mockIndicatorDocument();
    const {
      indicatorName,
      indicatorID: indicatorId,
      unitLabel,
    } = testIndicator;

    const testHealthDataPoint = mockHealthDataPoint({
      year: 0,
      ageBand: undefined,
      sex: undefined,
      datePeriod: mockDatePeriod({
        from: new Date('2023-04-06'),
        to: new Date('2024-04-05'),
        type: PeriodType.Financial,
      }),
    });

    const testArea = mockHealthDataForArea({
      indicatorSegments: [
        mockIndicatorSegment({
          sex: mockSexData({ value: 'Female' }),
          healthData: [testHealthDataPoint],
        }),
        mockIndicatorSegment({
          sex: mockSexData({ value: 'Persons' }),
          healthData: [testHealthDataPoint],
        }),
        mockIndicatorSegment({
          sex: mockSexData({ value: 'Male' }),
          healthData: [testHealthDataPoint],
        }),
      ],
    });

    const result = singleIndicatorBasicTableData(
      testArea,
      testIndicator,
      Frequency.Annually
    );

    const baseExpectedRow = {
      areaCode: 'E06000015',
      areaName: 'Derby',
      count: 5195,
      indicatorId: Number(indicatorId),
      indicatorName,
      period: '2023/24',
      trend: 'Cannot be calculated',
      unitLabel,
      value: 18.1,
    };

    expect(result).toEqual([
      {
        ...baseExpectedRow,
        indicatorName: `${indicatorName} (Persons, All ages)`,
      },
      {
        ...baseExpectedRow,
        indicatorName: `${indicatorName} (Male, All ages)`,
      },
      {
        ...baseExpectedRow,
        indicatorName: `${indicatorName} (Female, All ages)`,
      },
    ]);
  });

  it('returns null if indicatorSegments is missing', () => {
    const area = mockHealthDataForArea({ indicatorSegments: undefined });

    const result = singleIndicatorBasicTableData(
      area,
      mockIndicatorDocument(),
      Frequency.Annually
    );

    expect(result).toEqual([]);
  });
});
