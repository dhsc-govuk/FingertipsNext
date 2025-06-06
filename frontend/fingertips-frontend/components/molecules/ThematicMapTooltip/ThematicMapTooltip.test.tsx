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
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';

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
    areaName: 'Group Name',
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

  const stubEnglandData = {
    areaCode: 'areaCode3',
    areaName: 'Benchmark Name',
    healthData: [
      {
        year: 2023,
        value: 3,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: HealthDataPointTrendEnum.NotYetCalculated,
        deprivation: noDeprivation,
      },
    ],
  };

  it('should render the expected RAG tooltip content for an area', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(1);
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(
      screen.queryByText(stubAreaData.healthData[0].year.toString())
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`${formatNumber(stubAreaData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`Better than England (95%)`)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.Circle)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.Circle)).toHaveStyle({
      color: GovukColours.Green,
    });
  });

  it('should render the expected RAG tooltip content for an area and group', () => {
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

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(
      screen.queryAllByText(stubAreaData.healthData[0].year.toString())
    ).toHaveLength(2);
    expect(
      screen.queryByText(`${formatNumber(stubAreaData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`${formatNumber(stubGroupData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`Better than England (95%)`)).toBeInTheDocument();
    expect(screen.queryByText(`Worse than England (95%)`)).toBeInTheDocument();
    expect(screen.getAllByText(SymbolsEnum.Circle)).toHaveLength(2);
    expect(screen.getAllByText(SymbolsEnum.Circle)[0]).toHaveStyle({
      color: GovukColours.Red,
    });
    expect(screen.getAllByText(SymbolsEnum.Circle)[1]).toHaveStyle({
      color: GovukColours.Green,
    });
  });

  it('should render the expected RAG tooltip content for an area and benchmark', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForBenchmark={stubEnglandData}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(
      screen.queryByText(`Benchmark: ${stubEnglandData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(
      screen.queryAllByText(stubAreaData.healthData[0].year.toString())
    ).toHaveLength(2);
    expect(
      screen.queryByText(`${formatNumber(stubAreaData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        `${formatNumber(stubEnglandData?.healthData[0].value)} %`
      )
    ).toBeInTheDocument();
    expect(screen.queryByText(`Better than England (95%)`)).toBeInTheDocument();
    expect(screen.getAllByText(SymbolsEnum.Circle)).toHaveLength(2);
    expect(screen.getAllByText(SymbolsEnum.Circle)[0]).toHaveStyle({
      color: GovukColours.Black,
    });
    expect(screen.getAllByText(SymbolsEnum.Circle)[1]).toHaveStyle({
      color: GovukColours.Green,
    });
  });

  it('should render the expected RAG tooltip sections for an area, group and benchmark', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={stubGroupData}
        indicatorDataForBenchmark={stubEnglandData}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(3);
    expect(
      screen.queryByText(`Benchmark: ${stubEnglandData.areaName}`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.getAllByText(SymbolsEnum.Circle)[0]).toHaveStyle({
      color: GovukColours.Black,
    });
    expect(screen.getAllByText(SymbolsEnum.Circle)[1]).toHaveStyle({
      color: GovukColours.Red,
    });
    expect(screen.getAllByText(SymbolsEnum.Circle)[2]).toHaveStyle({
      color: GovukColours.Green,
    });
  });

  it('should render the expected RAG tooltip when Healthdata for the area is missing', () => {
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

    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.getAllByText('No data available')).toHaveLength(2);
    expect(screen.getAllByText(SymbolsEnum.MultiplicationX)).toHaveLength(2);
    expect(screen.getAllByText(SymbolsEnum.MultiplicationX)[0]).toHaveStyle({
      color: GovukColours.Black,
    });
    expect(screen.getAllByText(SymbolsEnum.MultiplicationX)[1]).toHaveStyle({
      color: GovukColours.Black,
    });
  });

  it('should render the expected RAG tooltip when Healthdata for the comparator area is missing', () => {
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
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.Circle)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.MultiplicationX)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.MultiplicationX)).toHaveStyle({
      color: GovukColours.Black,
    });
  });

  it('should render the expected RAG tooltip when Healthdata for the benchmark area is missing', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForBenchmark={{ ...stubEnglandData, healthData: [] }}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByText('No data available')).toHaveLength(1);
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(
      screen.queryByText(`Benchmark: ${stubEnglandData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.Circle)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.MultiplicationX)).toBeInTheDocument();
    expect(screen.getByText(SymbolsEnum.MultiplicationX)).toHaveStyle({
      color: GovukColours.Black,
    });
  });

  it('should have a pink circle for the comparator if the comparator is England', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={{
          ...stubEnglandData,
          areaCode: areaCodeForEngland,
        }}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByText(SymbolsEnum.Circle)[0]).toHaveStyle({
      color: GovukColours.Pink,
    });
  });

  it('should have a pink x for the compartor if the comparator is England but has no data', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        indicatorDataForComparator={{
          ...stubEnglandData,
          areaCode: areaCodeForEngland,
          healthData: [],
        }}
        polarity={IndicatorPolarity.Unknown}
      />
    );

    expect(screen.getAllByText(SymbolsEnum.MultiplicationX)[0]).toHaveStyle({
      color: GovukColours.Pink,
    });
  });
});
