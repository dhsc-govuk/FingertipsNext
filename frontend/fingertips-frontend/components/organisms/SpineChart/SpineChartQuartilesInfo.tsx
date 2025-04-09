import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

const DivContainer = styled.div({
  fontFamily: 'nta, Arial, sans-serif',
  marginBottom: '1rem',
  display: 'flex',
  justifyContent: 'right',
});

export const SpineChartQuartilesInfoContainer = () => {
  return (
    <DivContainer>
      <svg width={400} height={70}>
        <g transform={`translate(0, 25)`}>
          <rect
            x={50}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={149}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={249}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={348}
            y={0}
            width={2}
            height={25}
            fill={GovukColours.MidGrey}
          />

          <rect
            x={50}
            y={0}
            width={300}
            height={20}
            fill={GovukColours.MidGrey}
          />
          <rect
            x={150}
            y={0}
            width={100}
            height={20}
            fill={GovukColours.DarkGrey}
          />
          <rect
            x={200}
            y={-5}
            width={2}
            height={30}
            fill={GovukColours.Black}
          />
        </g>
        <g textAnchor={'middle'} fontSize={14}>
          <g transform={'translate(0, 65)'}>
            <text x={50}>Worst/lowest</text>
            <text x={150}>25th percentile</text>
            <text x={250}>75th percentile</text>
            <text x={350}>Best/highest</text>
          </g>
          <text x={200} y={15}>
            Benchmark value
          </text>
        </g>
      </svg>
    </DivContainer>
  );
};
