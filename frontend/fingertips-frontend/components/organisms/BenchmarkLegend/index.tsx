'use client';

import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { BenchmarkLegendGroup } from '@/components/organisms/BenchmarkLegend/BenchmarkLegendGroup';
import {
  allLegendItems,
  getOutcomes,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { BenchmarkLegends } from '@/components/organisms/BenchmarkLegend/BenchmarkLegends';
import {
  BenchmarkLegendHeader,
  LegendContainerWithMargin,
} from '@/components/organisms/BenchmarkLegend/BenchmarkLegend.styles';

interface BenchmarkLegendProps {
  title?: string;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  polarity?: IndicatorPolarity;
}

export const BenchmarkLegend: FC<BenchmarkLegendProps> = ({
  title = 'Compared to England',
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity = IndicatorPolarity.Unknown,
}) => {
  const outcomes = getOutcomes(benchmarkComparisonMethod, polarity);

  if (benchmarkComparisonMethod === BenchmarkComparisonMethod.Unknown)
    return <BenchmarkLegendAll title={title} />;

  return (
    <LegendContainerWithMargin data-testid="benchmarkLegend-component">
      <BenchmarkLegendHeader>{title}</BenchmarkLegendHeader>
      <BenchmarkLegendGroup
        polarity={polarity}
        benchmarkComparisonMethod={benchmarkComparisonMethod}
        outcomes={outcomes}
      />
    </LegendContainerWithMargin>
  );
};

interface BenchmarkLegendAllProps {
  title: string;
}

const BenchmarkLegendAll: FC<BenchmarkLegendAllProps> = ({ title }) => {
  return <BenchmarkLegends title={title} legendsToShow={allLegendItems} />;
};
