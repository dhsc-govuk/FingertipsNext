import { getBenchmarkLabelText } from '@/components/organisms/BenchmarkLabel';
import {
  BenchmarkComparisonMethod,
  BenchmarkOutcome,
  IndicatorPolarity,
} from '@/generated-sources/ft-api-client';
import { FC } from 'react';
import { getConfidenceLimitNumber } from '@/lib/chartHelpers/chartHelpers';
import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import { GovukColours } from '@/lib/styleHelpers/colours';

interface BenchmarkLegendProps {
  y?: number;
  benchmarkComparisonMethod?: BenchmarkComparisonMethod;
  outcomes: BenchmarkOutcome[];
  polarity: IndicatorPolarity;
  subTitle?: string;
}

export const BenchmarkLegendGroupSvg: FC<BenchmarkLegendProps> = ({
  y = 0,
  outcomes,
  benchmarkComparisonMethod = BenchmarkComparisonMethod.Unknown,
  polarity,
  subTitle,
}) => {
  const confidenceLimit = getConfidenceLimitNumber(benchmarkComparisonMethod);
  const prefix = confidenceLimit
    ? `${confidenceLimit}% confidence`
    : 'Quintiles';

  const subTitleText = subTitle ?? prefix;

  const gap = 10;
  let xPointer = 0;
  const items = outcomes.map((outcome) => {
    const x = xPointer;
    const txt = getBenchmarkLabelText(outcome);
    const width = 16 + txt.length * 8;
    xPointer += width + gap;
    const theme = getBenchmarkTagStyle(
      benchmarkComparisonMethod,
      outcome,
      polarity
    );
    return {
      key: `${benchmarkComparisonMethod}_${outcome}`,
      x,
      width,
      txt,
      color: theme?.color ?? GovukColours.White,
      backgroundColor: theme?.backgroundColor,
      stroke: theme?.border ? theme.color : 'none',
    };
  });

  return (
    <g transform={`translate(0,${y})`}>
      {subTitleText ? (
        <text y={12} fontSize={16}>
          {subTitleText}
        </text>
      ) : null}
      {items.map(({ key, txt, x, width, color, backgroundColor, stroke }) => (
        <g transform={`translate(${x},${subTitleText ? 20 : 6})`} key={key}>
          <rect
            x={0}
            y={0}
            width={width}
            height={26}
            fill={backgroundColor}
            stroke={stroke}
          />
          <text
            fontSize={16}
            x={width / 2}
            y={19}
            textAnchor={'middle'}
            fill={color}
          >
            {txt}
          </text>
        </g>
      ))}
    </g>
  );
};
