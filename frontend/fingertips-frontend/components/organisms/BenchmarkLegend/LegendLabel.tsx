'use client';
import { Label } from 'govuk-react';
import styled from 'styled-components';


const enum BenchmarkLegendType {
  HIGH ='high',
  LOWER = 'lower',
  BETTER ='better',
  SIMILAR ='similar',
  WORSE ='worse',
  NOT_COMPARED ='not_compared',
}

export interface BenchmarkLegendProps {
  label?: string;
  legendType? : BenchmarkLegendType | string 
}

const getBenchmarkLegendColourStyle = (type: BenchmarkLegendType) => {
  switch (type) {
    case BenchmarkLegendType.HIGH:
      return {
        backgroundColor: 'var(--other-dark-blue, #003078);',
        color: 'var(--other-white, #FFF)',
      };
    case BenchmarkLegendType.LOWER:
      return {
        backgroundColor: 'var(--other-light-blue, #5694CA);',
        color: 'var(--other-black, #0B0C0C);',
      };
    case BenchmarkLegendType.BETTER:
      return {
        backgroundColor: 'var(--other-green, #00703C)',
        color: 'var(--other-white, #FFF);',
      };
    case BenchmarkLegendType.SIMILAR:
      return {
        backgroundColor: 'var(--other-yellow, #FD0);',
        color: 'var(--other-black, #0B0C0C);',
      };
    case BenchmarkLegendType.WORSE:
      return {
        backgroundColor: 'var(--other-red, #D4351C);',
        color: 'var(--other-white, #FFF)',
      };
    default:
      return {
        backgroundColor: 'transparent',
        color: 'var(--other-black, #0B0C0C)',
        border: '1px solid #000',
      };
  }
};

export const BenchmarkLegendStyle = styled(Label)<{
  legendType: BenchmarkLegendType;
}>(({ legendType }) => {
  const dynamicStyle = getBenchmarkLegendColourStyle(legendType);
  return Object.assign(
    {
      display: 'inline-block',
      padding: '5px 8px 4px 8px',
      alignItems: 'center',
      fontSize: '12px',
      fontStyle: 'normal',
      fontWeight: '300',
      lineHeight: '16px',
      letterSpacing: '1px',
      margin:"0.5px",
      fontFamily: 'GDS Transport',
    },
    dynamicStyle
  );
});



export const LegendLabel :React.FC<BenchmarkLegendProps>  = ({
  label,
  legendType,
}) => {
  legendType = legendType ?? BenchmarkLegendType.NOT_COMPARED
  return (
    <BenchmarkLegendStyle legendType={legendType}>
      <Label>{label}</Label>
    </BenchmarkLegendStyle>
  );
};
