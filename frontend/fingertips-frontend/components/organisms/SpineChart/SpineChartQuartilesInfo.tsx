import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  margin: '1rem 0',
});

export const SpineChartQuartilesInfoContainer = () => {
  const w = 360;
  const q1 = w / 3;
  const q2 = q1 * 2;
  const fontSize = 16;
  return (
    <DivContainer>
      <svg width={w} height={90}>
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
            x={w - 2}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />

          <rect x={0} y={0} width={w} height={20} fill={GovukColours.MidGrey} />
          <rect
            x={q1}
            y={0}
            width={q2 - q1}
            height={20}
            fill={GovukColours.LightGrey}
          />
          <rect
            x={w / 2 - 1}
            y={-5}
            width={2}
            height={30}
            fill={GovukColours.Black}
          />
        </g>
        <g fontSize={fontSize}>
          <g transform={'translate(0, 68)'}>
            <text x={0} textAnchor={'start'}>
              Worst/
            </text>
            <text x={0} y={fontSize} textAnchor={'start'}>
              lowest
            </text>

            <text x={q1} textAnchor={'middle'}>
              25th
            </text>
            <text x={q1} y={fontSize} textAnchor={'middle'}>
              percentile
            </text>

            <text x={q2} textAnchor={'middle'}>
              75th
            </text>
            <text x={q2} y={fontSize} textAnchor={'middle'}>
              percentile
            </text>

            <text x={w} textAnchor={'end'}>
              Best/
            </text>
            <text x={w} y={fontSize} textAnchor={'end'}>
              highest
            </text>
          </g>
          <text x={w / 2} y={fontSize} textAnchor={'middle'}>
            Benchmark value
          </text>
        </g>
      </svg>
    </DivContainer>
  );
};
