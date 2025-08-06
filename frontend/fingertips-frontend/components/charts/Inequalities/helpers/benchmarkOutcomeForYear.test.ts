import { benchmarkOutcomeForYear } from '@/components/charts/Inequalities/helpers/benchmarkOutcomeForYear';
import { InequalitiesChartData } from '@/components/charts/Inequalities/helpers/inequalitiesHelpers';
import { BenchmarkOutcome } from '@/generated-sources/ft-api-client';

describe('benchmarkOutcomeForYear', () => {
  const chartData: InequalitiesChartData = {
    areaCode: 'Area1',
    areaName: 'Leeds',
    rowData: [
      {
        period: '2020',
        inequalities: {
          Male: {
            benchmarkComparison: {
              outcome: BenchmarkOutcome.Better,
            },
          },
          Female: {
            benchmarkComparison: {
              outcome: BenchmarkOutcome.Worse,
            },
          },
        },
      },
      {
        period: '2021',
        inequalities: {
          Male: {
            benchmarkComparison: {
              outcome: BenchmarkOutcome.Similar,
            },
          },
        },
      },
    ],
  };

  it('returns the correct outcome for existing year and inequality', () => {
    const result = benchmarkOutcomeForYear('2020', 'Male', chartData);
    expect(result).toBe(BenchmarkOutcome.Better);
  });

  it('returns NotCompared if inequality key does not exist for that year', () => {
    const result = benchmarkOutcomeForYear('2021', 'Female', chartData);
    expect(result).toBe(BenchmarkOutcome.NotCompared);
  });

  it('returns NotCompared if year is not present in the data', () => {
    const result = benchmarkOutcomeForYear('2019', 'Male', chartData);
    expect(result).toBe(BenchmarkOutcome.NotCompared);
  });

  it('returns NotCompared if benchmarkComparison is missing for inequality', () => {
    const modifiedChartData = {
      ...chartData,
      rowData: [
        {
          period: '2022',
          inequalities: {
            Other: {},
          },
        },
      ],
    };

    const result = benchmarkOutcomeForYear('2022', 'Other', modifiedChartData);
    expect(result).toBe(BenchmarkOutcome.NotCompared);
  });
});
