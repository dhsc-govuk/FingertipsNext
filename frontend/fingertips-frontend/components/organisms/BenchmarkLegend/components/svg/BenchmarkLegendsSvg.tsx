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
import { BenchmarkLegendGroupSvg } from '@/components/organisms/BenchmarkLegend/components/svg/BenchmarkLegendGroupSvg';
import { legendsSvgRenderConfig } from '@/components/organisms/BenchmarkLegend/helpers/legendsSvgRenderConfig';

interface BenchmarkLegendsProps {
  title?: string;
  legendsToShow: BenchmarkLegendsToShow;
}

export const BenchmarkLegendsSvg: FC<BenchmarkLegendsProps> = ({
  title = 'Compared to England',
  legendsToShow,
}) => {
  const {
    show95,
    outcomes95,
    show99,
    outcomes99,
    showQ,
    showQnoJudgement,
    hideDuplicateQuintileSubheading,
    cumulativeY,
    yValues,
  } = legendsSvgRenderConfig(legendsToShow);

  return (
    <svg
      data-testid="benchmarkLegend-component-svg"
      width={500}
      height={cumulativeY}
      className={'svgBenchmarkLegend'}
    >
      <g>
        <text y={16}>{title}</text>
        {show95 ? (
          <BenchmarkLegendGroupSvg
            y={yValues.y95}
            polarity={IndicatorPolarity.HighIsGood}
            benchmarkComparisonMethod={
              BenchmarkComparisonMethod.CIOverlappingReferenceValue95
            }
            outcomes={outcomes95}
          />
        ) : null}

        {show99 ? (
          <BenchmarkLegendGroupSvg
            y={yValues.y99}
            polarity={IndicatorPolarity.HighIsGood}
            benchmarkComparisonMethod={
              BenchmarkComparisonMethod.CIOverlappingReferenceValue99_8
            }
            outcomes={outcomes99}
          />
        ) : null}

        {showQnoJudgement ? (
          <BenchmarkLegendGroupSvg
            y={yValues.yQnoJudgement}
            polarity={IndicatorPolarity.NoJudgement}
            benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
            outcomes={quintilesOutcomes}
          />
        ) : null}

        {showQ ? (
          <BenchmarkLegendGroupSvg
            y={yValues.yQJudgement}
            polarity={IndicatorPolarity.HighIsGood}
            benchmarkComparisonMethod={BenchmarkComparisonMethod.Quintiles}
            outcomes={quintilesOutcomesWithJudgement}
            subTitle={hideDuplicateQuintileSubheading ? '' : undefined}
          />
        ) : null}
      </g>
    </svg>
  );
};
