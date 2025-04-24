'use client';

import styled from 'styled-components';
import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import BenchmarkLegendGroup from '@/components/organisms/BenchmarkLegend/BenchmarkLegendGroup';
import {
  bobOutcomes,
  getOutcomes,
  quintilesOutcomes,
  quintilesOutcomesWithJudgement,
  ragOutcomes,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';
import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';

const LegendContainerWithMargin = styled.div({
  marginBottom: '2em',
});

const LegendContainerNoMargin = styled.div({});

const BenchmarkLegendHeader = styled('h4')({
  alignSelf: 'stretch',
  margin: '16px 0 8px 0',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
  fontSize: '19px',
});

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
  const both = {
    judgement: true,
    noJudgement: true,
  };
  const all: BenchmarkLegendsToShow = {
    [BenchmarkComparisonMethod.CIOverlappingReferenceValue95]: both,
    [BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8]: both,
    [BenchmarkComparisonMethod.Quintiles]: both,
  };

  return <BenchmarkLegends title={title} legendsToShow={all} />;
};

interface BenchmarkLegendsProps {
  title?: string;
  legendsToShow: BenchmarkLegendsToShow;
  bottomMargin?: boolean;
}

export const BenchmarkLegends: FC<BenchmarkLegendsProps> = ({
  title = 'Compared to England',
  legendsToShow,
  bottomMargin = true,
}) => {
  const { judgement: judgement95 = false, noJudgement: noJudgement95 = false } =
    legendsToShow[BenchmarkComparisonMethod.CIOverlappingReferenceValue95] ??
    {};
  const outcomes95 = [
    ...new Set([
      ...(judgement95 ? ragOutcomes : []),
      ...(noJudgement95 ? bobOutcomes : []),
    ]),
  ];

  const { judgement: judgement99 = false, noJudgement: noJudgement99 = false } =
    legendsToShow[BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8] ??
    {};
  const outcomes99 = [
    ...new Set([
      ...(judgement99 ? ragOutcomes : []),
      ...(noJudgement99 ? bobOutcomes : []),
    ]),
  ];
  const { judgement: showQ = false, noJudgement: showQnoJudgement = false } =
    legendsToShow[BenchmarkComparisonMethod.Quintiles] ?? {};

  const show95 = outcomes95.length > 0;
  const show99 = outcomes99.length > 0;
  const hideDuplicateQuintileSubheading = showQ && showQnoJudgement;
  const LegendContainer = bottomMargin
    ? LegendContainerWithMargin
    : LegendContainerNoMargin;
  return (
    <LegendContainer data-testid="benchmarkLegend-component">
      <BenchmarkLegendHeader>{title}</BenchmarkLegendHeader>
      {show95 ? (
        <BenchmarkLegendGroup
          polarity={IndicatorPolarity.HighIsGood}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue95
          }
          outcomes={outcomes95}
        />
      ) : null}

      {show99 ? (
        <BenchmarkLegendGroup
          polarity={IndicatorPolarity.HighIsGood}
          benchmarkComparisonMethod={
            BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
          }
          outcomes={outcomes99}
        />
      ) : null}

      {showQnoJudgement ? (
        <BenchmarkLegendGroup
          polarity={IndicatorPolarity.NoJudgement}
          benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
          outcomes={quintilesOutcomes}
        />
      ) : null}

      {showQ ? (
        <BenchmarkLegendGroup
          polarity={IndicatorPolarity.HighIsGood}
          benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
          outcomes={quintilesOutcomesWithJudgement}
          subTitle={hideDuplicateQuintileSubheading ? '' : undefined}
        />
      ) : null}
    </LegendContainer>
  );
};
