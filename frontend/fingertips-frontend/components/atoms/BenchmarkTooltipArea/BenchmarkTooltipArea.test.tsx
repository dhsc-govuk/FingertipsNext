import {
  BenchmarkOutcome,
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';
import { BenchmarkTooltipArea } from './BenchmarkTooltipArea';
import { render, screen } from '@testing-library/react';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';

describe('BenchmarkTooltipArea', () => {
  const mockIndicatorData: HealthDataForArea = {
    areaCode: 'A001',
    areaName: 'RAG_area',
    healthData: [
      {
        year: 1976,
        ageBand: allAgesAge,
        sex: personsSex,
        trend: 'Not yet calculated',
        deprivation: noDeprivation,
        value: 333,
      },
    ],
  };
  const mockUnits = 'Mpa';
  const mockBenchmarkArea = 'England';

  it.each([
    [
      BenchmarkOutcome.NotCompared,
      'Not compared',
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.MultiplicationX,
    ],
    [
      BenchmarkOutcome.Better,
      `than ${mockBenchmarkArea}`,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8,
    ],
    [BenchmarkOutcome.Similar, `to ${mockBenchmarkArea}`],
    [BenchmarkOutcome.Worse, `than ${mockBenchmarkArea}`],
    [BenchmarkOutcome.Lower, `than ${mockBenchmarkArea}`],
    [BenchmarkOutcome.Higher, `than ${mockBenchmarkArea}`],
  ])(
    'should return the expected RAG tooltip for an area',
    (
      testBenchmarkOutcome: BenchmarkOutcome,
      expectedComparisonString?: string,
      testBenchmarkComparisonMethod: BenchmarkComparisonMethod = BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      expectedSymbol: SymbolsEnum = SymbolsEnum.Circle
    ) => {
      const testIndicatorDataForArea = mockIndicatorData;
      testIndicatorDataForArea.healthData[0].benchmarkComparison = {
        outcome: testBenchmarkOutcome,
        method: testBenchmarkComparisonMethod,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;
      const expectedColour =
        getBenchmarkColour(
          testIndicatorDataForArea.healthData[0].benchmarkComparison.method ??
            BenchmarkComparisonMethod.Unknown,
          testIndicatorDataForArea.healthData[0].benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared,
          testPolarity
        ) ?? undefined;

      if (
        expectedComparisonString &&
        testBenchmarkOutcome !== BenchmarkOutcome.NotCompared
      ) {
        expectedComparisonString = [
          testBenchmarkOutcome,
          expectedComparisonString,
        ].join(' ');
      }

      render(
        <BenchmarkTooltipArea
          indicatorData={testIndicatorDataForArea}
          benchmarkComparisonMethod={testBenchmarkComparisonMethod}
          measurementUnit={mockUnits}
          tooltipType={'area'}
        />
      );

      expect(screen.getByText(mockIndicatorData.areaName)).toBeInTheDocument();
      expect(
        screen.getByText(mockIndicatorData.healthData[0].year)
      ).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toHaveStyle({
        color: expectedColour,
      });

      expect(
        screen.getByText(
          RegExp(formatNumber(mockIndicatorData.healthData[0].value))
        )
      ).toBeInTheDocument();

      expect(screen.getByText(RegExp(mockUnits))).toBeInTheDocument();
      if (expectedComparisonString) {
        expect(screen.getByText(expectedComparisonString)).toBeInTheDocument();
      }
    }
  );

  it.each([
    [BenchmarkOutcome.NotCompared, SymbolsEnum.MultiplicationX],
    [BenchmarkOutcome.Lowest],
    [BenchmarkOutcome.Low],
    [BenchmarkOutcome.Middle],
    [BenchmarkOutcome.High],
    [BenchmarkOutcome.Highest],
    [BenchmarkOutcome.Best],
    [BenchmarkOutcome.Worst],
  ])(
    'should return the expected Quintiles tooltip',
    (
      testBenchmarkOutcome: BenchmarkOutcome,
      expectedSymbol: SymbolsEnum = SymbolsEnum.Circle
    ) => {
      const testBenchmarkComparisonMethod = BenchmarkComparisonMethod.Quintiles;
      const testIndicatorDataForArea = mockIndicatorData;
      testIndicatorDataForArea.healthData[0].benchmarkComparison = {
        outcome: testBenchmarkOutcome,
        method: testBenchmarkComparisonMethod,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;
      const expectedColour =
        getBenchmarkColour(
          testIndicatorDataForArea.healthData[0].benchmarkComparison.method ??
            BenchmarkComparisonMethod.Unknown,
          testIndicatorDataForArea.healthData[0].benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared,
          testPolarity
        ) ?? undefined;

      render(
        <BenchmarkTooltipArea
          indicatorData={testIndicatorDataForArea}
          benchmarkComparisonMethod={testBenchmarkComparisonMethod}
          measurementUnit={mockUnits}
          tooltipType={'area'}
        />
      );

      expect(screen.getByText(mockIndicatorData.areaName)).toBeInTheDocument();
      expect(
        screen.getByText(mockIndicatorData.healthData[0].year)
      ).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toHaveStyle({
        color: expectedColour,
      });

      expect(
        screen.getByText(
          RegExp(formatNumber(mockIndicatorData.healthData[0].value))
        )
      ).toBeInTheDocument();

      expect(screen.getByText(RegExp(mockUnits))).toBeInTheDocument();
      expect(screen.getByText(RegExp('quintile'))).toBeInTheDocument();
      expect(screen.queryByText(/England/)).not.toBeInTheDocument();
      expect(screen.queryByText(/than/)).not.toBeInTheDocument();
      expect(screen.queryByText(/to/)).not.toBeInTheDocument();
    }
  );

  it('should include Group when passed a RAG group', () => {
    render(
      <BenchmarkTooltipArea
        indicatorData={mockIndicatorData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={mockUnits}
        tooltipType={'group'}
      />
    );
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
  });
  it('should include Benchmark and only required elements when passed a RAG bechmark', () => {
    render(
      <BenchmarkTooltipArea
        indicatorData={mockIndicatorData}
        benchmarkComparisonMethod={
          BenchmarkComparisonMethod.CIOverlappingReferenceValue95
        }
        measurementUnit={mockUnits}
        tooltipType={'benchmark'}
      />
    );
    expect(screen.queryByText(/Benchmark/)).toBeInTheDocument();
    expect(screen.queryByText(/England/)).not.toBeInTheDocument();
    expect(screen.queryByText(/than/)).not.toBeInTheDocument();
    expect(screen.queryByText(/to/)).not.toBeInTheDocument();
  });
});
