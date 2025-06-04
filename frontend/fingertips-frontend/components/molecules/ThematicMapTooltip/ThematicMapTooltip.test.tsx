import { render, screen } from '@testing-library/react';
import { ThematicMapTooltip } from './index';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  HealthDataForArea,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, personsSex, noDeprivation } from '@/lib/mocks';
import { formatNumber } from '@/lib/numberFormatter';

describe('ThematicMapTooltip', () => {
  const stubAreaData: HealthDataForArea = {
    areaCode: 'areaCode1',
    areaName: 'Area Name 1',
    healthData: [
      {
        year: 2023,
        value: 1,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        benchmarkComparison: {
          benchmarkAreaCode: areaCodeForEngland,
          benchmarkAreaName: 'England',
          benchmarkValue: 2,
          outcome: BenchmarkOutcome.Better,
        },
      },
    ],
  };

  const stubGroupData = {
    areaCode: 'areaCode2',
    areaName: 'Area Name 2',
    healthData: [
      {
        year: 2023,
        value: 3,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
        benchmarkComparison: {
          benchmarkAreaCode: areaCodeForEngland,
          benchmarkAreaName: 'England',
          benchmarkValue: 4,
          outcome: BenchmarkOutcome.Worse,
        },
      },
    ],
  };

  it('should render the expected tooltip content', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(3);
    // Area Names
    expect(
      screen.queryByText(
        `Benchmark: ${stubAreaData.healthData[0].benchmarkComparison?.benchmarkAreaName}`
      )
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    // Years
    expect(
      screen.queryAllByText(stubAreaData.healthData[0].year.toString())
    ).toHaveLength(3);
    // Values
    expect(
      screen.queryByText(`${formatNumber(stubAreaData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`${formatNumber(stubGroupData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        `${formatNumber(stubGroupData?.healthData[0].value)} %`
      )
    ).toBeInTheDocument();
    // Comparison Text
    expect(screen.queryByText(`Better than England (95%)`)).toBeInTheDocument();
    expect(screen.queryByText(`Worse than England (95%)`)).toBeInTheDocument();
  });

  it('should render the expected tooltip when Healthdata for the area missing', () => {
    render(
      <ThematicMapTooltip
        indicatorData={{ ...stubAreaData, healthData: [] }}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByText('No data available')).toHaveLength(2);
    // Area Names
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
  });

  it('should render the expected tooltip when Healthdata for the comparator area missing', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={{ ...stubGroupData, healthData: [] }}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByText('No data available')).toHaveLength(1);
    // Area Names
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(
      screen.queryByText(
        `Benchmark: ${stubAreaData.healthData[0].benchmarkComparison?.benchmarkAreaName}`
      )
    ).toBeInTheDocument();
  });
});
