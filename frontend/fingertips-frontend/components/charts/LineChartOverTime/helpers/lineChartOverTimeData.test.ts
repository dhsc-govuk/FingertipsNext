import { lineChartOverTimeData } from '@/components/charts/LineChartOverTime/helpers/lineChartOverTimeData';
import { mockIndicatorDocument } from '@/mock/data/mockIndicatorDocument';
import { mockIndicatorWithHealthDataForArea } from '@/mock/data/mockIndicatorWithHealthDataForArea';
import { mockHealthDataPoints } from '@/mock/data/mockHealthDataPoint';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { mockHealthDataForArea } from '@/mock/data/mockHealthDataForArea';
import { generateStandardLineChartOptions } from '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions';
import { Options } from 'highcharts';

jest.mock(
  '@/components/organisms/LineChart/helpers/generateStandardLineChartOptions'
);

const mockGenerateStandardLineChartOptions =
  generateStandardLineChartOptions as jest.MockedFunction<
    typeof generateStandardLineChartOptions
  >;

mockGenerateStandardLineChartOptions.mockReturnValue({
  chart: 'options',
} as Options);

describe('lineChartOverTimeData', () => {
  const indicatorMetaData = mockIndicatorDocument();
  const healthData = mockIndicatorWithHealthDataForArea({
    areaHealthData: [
      mockHealthDataForArea({
        healthData: mockHealthDataPoints([{ year: 2023 }, { year: 2024 }]),
      }),
    ],
  });

  const healthDataForTwoAreas = mockIndicatorWithHealthDataForArea({
    benchmarkMethod: BenchmarkComparisonMethod.Quintiles,
    areaHealthData: [
      mockHealthDataForArea({
        healthData: mockHealthDataPoints([{ year: 2023 }, { year: 2024 }]),
      }),
      mockHealthDataForArea({
        areaCode: 'B',
        areaName: 'B',
        healthData: mockHealthDataPoints([{ year: 2023 }, { year: 2024 }]),
      }),
    ],
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns chart data when one area has more than 1 time point', () => {
    const result = lineChartOverTimeData(indicatorMetaData, healthData, ['A']);

    expect(result).toMatchObject({
      chartOptions: { chart: 'options' },
      indicatorMetaData,
      polarity: IndicatorPolarity.LowIsGood,
      benchmarkComparisonMethod:
        BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      benchmarkToUse: 'E92000001',
    });
  });

  it('returns chart data for two areas with quintile method', () => {
    const result = lineChartOverTimeData(
      indicatorMetaData,
      healthDataForTwoAreas,
      ['A', 'B']
    );
    //
    expect(result).toMatchObject({
      chartOptions: { chart: 'options' },
      indicatorMetaData,
      polarity: IndicatorPolarity.LowIsGood,
      benchmarkComparisonMethod: BenchmarkComparisonMethod.Quintiles,
      benchmarkToUse: 'E92000001',
    });
  });

  it('returns null when there are no valid time series data', () => {
    const result = lineChartOverTimeData(
      indicatorMetaData,
      mockIndicatorWithHealthDataForArea({
        areaHealthData: [mockHealthDataForArea({ healthData: [] })],
      }),
      ['A']
    );

    expect(result).toBeNull();
  });

  it('handles optional group and benchmark inputs gracefully', () => {
    const result = lineChartOverTimeData(
      indicatorMetaData,
      healthData,
      ['A'],
      undefined,
      undefined
    );

    expect(result?.chartOptions).toEqual({ chart: 'options' });
    expect(result?.benchmarkToUse).toEqual('E92000001');
  });
});
