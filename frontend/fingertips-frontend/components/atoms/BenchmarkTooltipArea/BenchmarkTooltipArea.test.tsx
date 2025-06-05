import {
  BenchmarkOutcome,
  BenchmarkComparisonMethod,
  IndicatorPolarity,
  HealthDataForArea,
} from '@/generated-sources/ft-api-client';
import { getBenchmarkColour } from '@/lib/chartHelpers/chartHelpers';

import { render, screen } from '@testing-library/react';
import { allAgesAge, noDeprivation, personsSex } from '@/lib/mocks';
import { SymbolsEnum } from '@/lib/chartHelpers/pointFormatterHelper';
import { formatNumber } from '@/lib/numberFormatter';
import { GovukColours } from '@/lib/styleHelpers/colours';
import { BenchmarkTooltipArea } from '@/components/atoms/BenchmarkTooltipArea/index';

// TODO: add symbols to these tests
// TODO: add symbol colours to these tests
describe('BenchmarkTooltipArea', () => {
  describe('areas', () => {
    it('should render the expected tooltip for an area', () => {
      render(
        <BenchmarkTooltipArea
          titleText="Test Area"
          year={1976}
          valueText={'some string'}
          comparisonText="test text"
        />
      );
      expect(screen.getByText('Test Area')).toBeInTheDocument();
      expect(screen.getByText('1976')).toBeInTheDocument();
      expect(screen.getByText('some string')).toBeInTheDocument();
      expect(screen.getByText('test text')).toBeInTheDocument();
    });
  });
});

describe.skip('OLD_BenchmarkTooltipArea', () => {
  const mockIndicatorData: HealthDataForArea = {
    areaCode: 'A001',
    areaName: 'test area',
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
      SymbolsEnum.WhiteCircle,
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
      testBenchmarkOutcome?: BenchmarkOutcome,
      expectedComparisonString?: string,
      testBenchmarkComparisonMethod: BenchmarkComparisonMethod = BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      expectedSymbol: SymbolsEnum = SymbolsEnum.Circle
    ) => {
      const testIndicatorDataForArea = mockIndicatorData;
      testIndicatorDataForArea.healthData[0].benchmarkComparison = {
        outcome: testBenchmarkOutcome,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;
      const expectedColour =
        getBenchmarkColour(
          testBenchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
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
          titleText={testIndicatorDataForArea.areaName}
          year={testIndicatorDataForArea.healthData[0].year}
          value={testIndicatorDataForArea.healthData[0].value}
          measurementUnit={mockUnits}
          tooltipType={'area'}
          comparisonText="test"

          // mostRecentDataPoint={testIndicatorDataForArea.healthData[0]}
          // indicatorData={testIndicatorDataForArea}
          // benchmarkComparisonMethod={testBenchmarkComparisonMethod}
          // polarity={testPolarity}
        />
      );

      expect(screen.getByText(mockIndicatorData.areaName)).toBeInTheDocument();
      expect(
        screen.getByText(mockIndicatorData.healthData[0].year)
      ).toBeInTheDocument();
      // expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
      // expect(screen.getByText(expectedSymbol)).toHaveStyle({
      //   color: expectedColour,
      // });

      expect(
        screen.getByText(
          RegExp(formatNumber(mockIndicatorData.healthData[0].value))
        )
      ).toBeInTheDocument();

      expect(screen.getByText(RegExp(mockUnits))).toBeInTheDocument();
      // TODO: unit test this behavior
      // if (expectedComparisonString) {
      //   expect(screen.getByText(expectedComparisonString)).toBeInTheDocument();
      // }
    }
  );

  it('should return the expected tooltip when there is no data', () => {
    const expectedSymbol = SymbolsEnum.MultiplicationX;
    const expectedColour = GovukColours.Black;
    const testIndicatorDataForArea = { ...mockIndicatorData, healthData: [] };

    render(
      <BenchmarkTooltipArea
        titleText={testIndicatorDataForArea.areaName}
        year={undefined}
        value={undefined}
        measurementUnit={mockUnits}
        tooltipType={'area'}
      />
    );

    expect(screen.getByText(mockIndicatorData.areaName)).toBeInTheDocument();
    // expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
    // expect(screen.getByText(expectedSymbol)).toHaveStyle({
    //   color: expectedColour,
    // });
    expect(screen.getByText('No data available')).toBeInTheDocument(); // Added to util unit test
  });

  it.each([
    // [BenchmarkOutcome.NotCompared, SymbolsEnum.WhiteCircle],
    [BenchmarkOutcome.Lowest],
    // [BenchmarkOutcome.Low],
    // [BenchmarkOutcome.Middle],
    // [BenchmarkOutcome.High],
    // [BenchmarkOutcome.Highest],
    // [BenchmarkOutcome.Best],
    // [BenchmarkOutcome.Worst],
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
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;
      const expectedColour =
        getBenchmarkColour(
          testBenchmarkComparisonMethod ?? BenchmarkComparisonMethod.Unknown,
          testIndicatorDataForArea.healthData[0].benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared,
          testPolarity
        ) ?? undefined;

      render(
        <BenchmarkTooltipArea
          titleText={testIndicatorDataForArea.areaName}
          year={testIndicatorDataForArea.healthData[0].year}
          value={testIndicatorDataForArea.healthData[0].value}
          measurementUnit={mockUnits}
          tooltipType={'area'}
          // comparisonText="test"
        />
      );

      expect(screen.getByText(mockIndicatorData.areaName)).toBeInTheDocument();
      expect(
        screen.getByText(mockIndicatorData.healthData[0].year)
      ).toBeInTheDocument();
      // expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
      // expect(screen.getByText(expectedSymbol)).toHaveStyle({
      //   color: expectedColour,
      // });

      expect(
        screen.getByText(
          RegExp(formatNumber(mockIndicatorData.healthData[0].value))
        )
      ).toBeInTheDocument();

      expect(screen.getByText(RegExp(mockUnits))).toBeInTheDocument();
      expect(screen.getByText(RegExp('quintile'))).toBeInTheDocument();
      // expect(screen.queryByText(/England/)).not.toBeInTheDocument();
      // expect(screen.queryByText(/than/)).not.toBeInTheDocument();
      // expect(screen.queryByText(/to/)).not.toBeInTheDocument();
    }
  );

  it('should include Group when passed a RAG group', () => {
    render(
      <BenchmarkTooltipArea
        titleText={mockIndicatorData.areaName}
        year={mockIndicatorData.healthData[0].year}
        value={mockIndicatorData.healthData[0].value}
        measurementUnit={mockUnits}
        tooltipType={'comparator'}
      />
    );
    expect(screen.queryByText(/Group/)).toBeInTheDocument();
  });

  it.skip('should include Benchmark and only required elements when passed a RAG benchmark', () => {
    render(
      <BenchmarkTooltipArea
        titleText={mockBenchmarkArea}
        year={mockIndicatorData.healthData[0].year}
        value={mockIndicatorData.healthData[0].value}
        measurementUnit={mockUnits}
        tooltipType={'benchmark'}
      />
    );
    expect(screen.queryByText(/Benchmark/)).toBeInTheDocument();
    expect(screen.queryByText(/England/)).not.toBeInTheDocument();
    expect(screen.queryByText(/than/)).not.toBeInTheDocument();
    expect(screen.queryByText(/to/)).not.toBeInTheDocument();
  });

  it('should not include comparison text when tooltipType is comparator and area is England', () => {
    render(
      <BenchmarkTooltipArea
        titleText={mockBenchmarkArea}
        year={mockIndicatorData.healthData[0].year}
        value={mockIndicatorData.healthData[0].value}
        measurementUnit={mockUnits}
        tooltipType={'comparator'}
      />
    );
    expect(screen.queryByText(/Group/)).not.toBeInTheDocument();
    expect(screen.queryByText(/England/)).toBeInTheDocument();
    expect(screen.queryByText(/than/)).not.toBeInTheDocument();
    expect(screen.queryByText(/to/)).not.toBeInTheDocument();
  });
});
