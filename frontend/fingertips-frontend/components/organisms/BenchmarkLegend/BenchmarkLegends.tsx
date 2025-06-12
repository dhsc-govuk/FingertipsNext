import { FC } from 'react';
import {
  BenchmarkComparisonMethod,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import {
  quintilesOutcomes,
  quintilesOutcomesWithJudgement,
} from '@/components/organisms/BenchmarkLegend/benchmarkLegendHelpers';

import { BenchmarkLegendsToShow } from '@/components/organisms/BenchmarkLegend/benchmarkLegend.types';
import {
  BenchmarkLegendHeader,
  LegendContainerNoMargin,
  LegendContainerWithMargin,
} from '@/components/organisms/BenchmarkLegend/BenchmarkLegend.styles';
import { BenchmarkLegendGroup } from '@/components/organisms/BenchmarkLegend/BenchmarkLegendGroup';
import { BenchmarkLegendsSvg } from '@/components/organisms/BenchmarkLegend/components/svg/BenchmarkLegendsSvg';
import { legendsRenderConfig } from '@/components/organisms/BenchmarkLegend/helpers/legendsRenderConfig';

interface BenchmarkLegendsProps {
  title?: string;
  legendsToShow: BenchmarkLegendsToShow;
  bottomMargin?: boolean;
  svg?: boolean;
}

export const BenchmarkLegends: FC<BenchmarkLegendsProps> = ({
  title = 'Compared to England',
  legendsToShow,
  bottomMargin = true,
  svg = false,
}) => {
  const {
    show95,
    outcomes95,
    show99,
    outcomes99,
    showQ,
    showQnoJudgement,
    hideDuplicateQuintileSubheading,
  } = legendsRenderConfig(legendsToShow);

  const LegendContainer = bottomMargin
    ? LegendContainerWithMargin
    : LegendContainerNoMargin;
  return (
    <>
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
      {svg ? (
        <div style={{ position: 'absolute', visibility: 'hidden' }}>
          <BenchmarkLegendsSvg legendsToShow={legendsToShow} title={title} />
        </div>
      ) : null}
    </>
  );
};
