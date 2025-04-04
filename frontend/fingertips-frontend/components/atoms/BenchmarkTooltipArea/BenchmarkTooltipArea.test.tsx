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
  const mockIndicatorData: Record<string, HealthDataForArea> = {
    RAG: {
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
    },
  };
  const mockUnits = 'Mpa';
  const mockBenchmarkArea = 'England';

  it.each([
    [
      BenchmarkOutcome.NotCompared,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.MultiplicationX,
      undefined,
    ],
    [
      BenchmarkOutcome.Better,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.Circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Similar,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.Circle,
      `to ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Worse,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.Circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Lower,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.Circle,
      `than ${mockBenchmarkArea}`,
    ],
    [
      BenchmarkOutcome.Higher,
      BenchmarkComparisonMethod.CIOverlappingReferenceValue95,
      SymbolsEnum.Circle,
      `than ${mockBenchmarkArea}`,
    ],
  ])(
    'should return the expected RAG tooltip for an area',
    (
      testBenchmarkOutcome: BenchmarkOutcome,
      testBenchmarkComparisonMethod: BenchmarkComparisonMethod,
      expectedSymbol: SymbolsEnum,
      expectedComparisonString?: string
    ) => {
      const testIndicatorDataForArea = mockIndicatorData.RAG;

      testIndicatorDataForArea.healthData[0].benchmarkComparison = {
        method: testBenchmarkComparisonMethod,
        outcome: testBenchmarkOutcome,
      };

      const testPolarity: IndicatorPolarity = IndicatorPolarity.Unknown;
      const expectedColour =
        getBenchmarkColour(
          testIndicatorDataForArea.healthData[0].benchmarkComparison.method ??
            BenchmarkComparisonMethod.Unknown,
          testIndicatorDataForArea.healthData[0].benchmarkComparison?.outcome ??
            BenchmarkOutcome.NotCompared,
          testPolarity
        ) ?? '';

      if (expectedComparisonString) {
        expectedComparisonString = [
          testBenchmarkOutcome,
          expectedComparisonString,
        ].join(' ');
      }

      render(
        <BenchmarkTooltipArea
          indicatorDataForArea={testIndicatorDataForArea}
          benchmarkComparisonMethod={testBenchmarkComparisonMethod}
          polarity={testPolarity}
          measurementUnit={mockUnits}
          benchmarkArea={mockBenchmarkArea}
        />
      );

      expect(
        screen.getByText(mockIndicatorData.RAG.areaName)
      ).toBeInTheDocument();
      expect(
        screen.getByText(mockIndicatorData.RAG.healthData[0].year)
      ).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toBeInTheDocument();
      expect(screen.getByText(expectedSymbol)).toHaveStyle({
        color: expectedColour,
      });

      expect(
        screen.getByText(
          RegExp(formatNumber(mockIndicatorData.RAG.healthData[0].value))
        )
      ).toBeInTheDocument();

      expect(screen.getByText(RegExp(mockUnits))).toBeInTheDocument();
      if (expectedComparisonString) {
        expect(screen.getByText(expectedComparisonString)).toBeInTheDocument();
      }
    }
  );

  //   each([
  //     [BenchmarkOutcome.Lowest],
  //     [BenchmarkOutcome.Low],
  //     [BenchmarkOutcome.Middle],
  //     [BenchmarkOutcome.High],
  //     [BenchmarkOutcome.Highest],
  //     [BenchmarkOutcome.Best],
  //     [BenchmarkOutcome.Worst],
  // ]
  //   )
  it.todo(
    'should return the expected RAG tooltip for an area when outcome is similar'
  );
});
