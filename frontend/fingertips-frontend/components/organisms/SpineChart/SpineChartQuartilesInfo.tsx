import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  margin: '1rem 0',
});

const spineChartLegendWidth = 360;
const spineChartLegendFontSize = 16;

export const SpineChartQuartilesInfoContainer = () => {
  const q1 = spineChartLegendWidth / 3;
  const q2 = q1 * 2;

  return (
    <DivContainer>
      <svg width={spineChartLegendWidth} height={90}>
        <g transform={`translate(0, 25)`}>
          <rect x={0} y={0} width={2} height={25} fill={GovukColours.MidGrey} />
          <rect
            x={q1 - 1}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={q2 - 1}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={spineChartLegendWidth - 2}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />

          <rect
            x={0}
            y={0}
            width={spineChartLegendWidth}
            height={20}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={q1}
            y={0}
            width={q2 - q1}
            height={20}
            fill={GovukColours.LightGrey}
          />
          <rect
            x={spineChartLegendWidth / 2 - 1}
            y={-5}
            width={2}
            height={30}
            fill={GovukColours.Black}
          />
        </g>
        <g fontSize={spineChartLegendFontSize}>
          <g transform={'translate(0, 68)'}>
            <text x={0} textAnchor={'start'}>
              Worst/
            </text>
            <text x={0} y={spineChartLegendFontSize} textAnchor={'start'}>
              lowest
            </text>

            <text x={q1} textAnchor={'middle'}>
              25th
            </text>
            <text x={q1} y={spineChartLegendFontSize} textAnchor={'middle'}>
              percentile
            </text>

            <text x={q2} textAnchor={'middle'}>
              75th
            </text>
            <text x={q2} y={spineChartLegendFontSize} textAnchor={'middle'}>
              percentile
            </text>

            <text x={spineChartLegendWidth} textAnchor={'end'}>
              Best/
            </text>
            <text
              x={spineChartLegendWidth}
              y={spineChartLegendFontSize}
              textAnchor={'end'}
            >
              highest
            </text>
          </g>
          <text
            x={spineChartLegendWidth / 2}
            y={spineChartLegendFontSize}
            textAnchor={'middle'}
          >
            Benchmark value
          </text>
        </g>
      </svg>
    </DivContainer>
  );
};
