import { render, screen } from '@testing-library/react';
import { ThematicMapTooltip } from './index';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  DatePeriod,
  Frequency,
  HealthDataPointTrendEnum,
  IndicatorPolarity,
  PeriodType,
} from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { allAgesAge, personsSex, noDeprivation } from '@/lib/mocks';
import { formatNumber } from '@/lib/numberFormatter';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { formatDatePointLabel } from '@/lib/timePeriodHelpers/getTimePeriodLabels';
import {
  mockHealthDataForArea,
  mockHealthDataForArea_England,
  mockHealthDataForArea_Group,
} from '@/mock/data/mockHealthDataForArea';

const stubAreaData = mockHealthDataForArea({
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
});

const stubGroupData = mockHealthDataForArea_Group();

const stubEnglandData = mockHealthDataForArea_England();
const mockFrequency = Frequency.Annually;
const mockDatePeriod: DatePeriod = {
  type: PeriodType.Financial,
  from: new Date('2008-01-01'),
  to: new Date('2008-12-31'),
};
const expectedDatePointLabel = formatDatePointLabel(
  mockDatePeriod,
  mockFrequency,
  true
);

describe('ThematicMapTooltip', () => {
  it('should render the expected RAG tooltip content for an area', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse="England"
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(1);
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.queryByText(expectedDatePointLabel)).toBeInTheDocument();
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
        groupData={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(
      screen.queryByText(`Group: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.queryAllByText(expectedDatePointLabel)).toHaveLength(2);
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

  it('should render the expected RAG tooltip content for an area and benchmark of England', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        englandData={stubEnglandData}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(
      screen.queryByText(`Benchmark: ${stubEnglandData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.queryAllByText(expectedDatePointLabel)).toHaveLength(2);
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

  it('should render the expected RAG tooltip content for an area and benchmark of group', () => {
    render(
      <ThematicMapTooltip
        indicatorData={stubAreaData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={'%'}
        groupData={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={stubGroupData.areaCode}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
      />
    );

    expect(screen.getAllByTestId('benchmark-tooltip-area')).toHaveLength(2);
    expect(
      screen.queryByText(`Benchmark: ${stubGroupData.areaName}`)
    ).toBeInTheDocument();
    expect(screen.queryByText(`${stubAreaData.areaName}`)).toBeInTheDocument();
    expect(screen.queryAllByText(expectedDatePointLabel)).toHaveLength(2);
    expect(
      screen.queryByText(`${formatNumber(stubAreaData.healthData[0].value)} %`)
    ).toBeInTheDocument();
    expect(
      screen.queryByText(
        `${formatNumber(stubGroupData?.healthData[0].value)} %`
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
        groupData={stubGroupData}
        englandData={stubEnglandData}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
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
        groupData={stubGroupData}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
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
        groupData={{ ...stubGroupData, healthData: [] }}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
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
        englandData={{ ...stubEnglandData, healthData: [] }}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
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
        groupData={{
          ...stubEnglandData,
          areaCode: areaCodeForEngland,
        }}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
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
        groupData={{
          ...stubEnglandData,
          areaCode: areaCodeForEngland,
          healthData: [],
        }}
        polarity={IndicatorPolarity.Unknown}
        benchmarkToUse={areaCodeForEngland}
        frequency={mockFrequency}
        latestDataPeriod={mockDatePeriod}
      />
    );

    expect(screen.getAllByText(SymbolsEnum.MultiplicationX)[0]).toHaveStyle({
      color: GovukColours.Pink,
    });
  });
});
