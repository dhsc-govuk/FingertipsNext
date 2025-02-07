'use client';
import { Label } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';

export const enum BenchmarkLabelType {
  HIGHER = 'higher',
  LOWER = 'lower',
  BETTER = 'better',
  SIMILAR = 'similar',
  LOWEST = 'lowest',
  LOW = 'low',
  MIDDLE = 'middle',
  HIGH = 'high',
  HIGHEST = 'highest',
  WORST = 'worst',
  WORSE = 'worse',
  BEST = 'best',
  NOT_COMPARED = 'not_compared',
}

export const enum BenchmarkLabelGroupType {
  RAG = 'rag',
  QUINTILES = 'quintiles',
  QUINTILES_WITH_VALUE = 'quintiles_with_value',
}

export interface BenchmarkLabelProps {
  label?: string;
  type?: BenchmarkLabelType | string;
  group?: BenchmarkLabelGroupType | string;
}



export const getLabelValueFromType = (type: string) =>{
  return `type =${type}`
}


export const getBenchmarkLabelStyle = (
  group = BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
  type
) => {
  if (group === BenchmarkLabelGroupType.RAG) {
    switch (type) {
      case BenchmarkLabelType.LOWER:
        return {
          backgroundColor: 'var(--other-light-blue, #5694CA)',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.BETTER:
        return {
          backgroundColor: 'var(--other-green, #00703C)',
          color: 'var(--other-white, #FFF)',
        };
      case BenchmarkLabelType.SIMILAR:
        return {
          backgroundColor: 'var(--other-yellow, #FD0)',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.WORSE:
        return {
          backgroundColor: 'var(--other-red, #D4351C)',
          color: 'var(--other-white, #FFF)',
        };
      case BenchmarkLabelType.HIGHER:
        return {
          backgroundColor: 'var(--other-dark-blue, #003078)',
          color: 'var(--other-white, #FFF)',
        };
      default:
        return {
          backgroundColor: 'transparent',
          color: 'var(--other-black, #0B0C0C)',
          border: '1px solid #000',
        };
    }
  }

  if (group === BenchmarkLabelGroupType.QUINTILES) {
    switch (type) {
      case BenchmarkLabelType.LOWEST:
        return {
          backgroundColor: '#E4DDFF',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.LOW:
        return {
          backgroundColor: '#CBBEF4',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.MIDDLE:
        return {
          backgroundColor: '#AA90EC',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.HIGH:
        return {
          backgroundColor: '#8B60E2',
          color: 'var(--other-white, #FFF)',
        };
      default:
        return {
          backgroundColor: '#6B33C3',
          color: 'var(--other-white, #FFF)',
        };
    }
  }

  if (group === BenchmarkLabelGroupType.QUINTILES_WITH_VALUE) {
    switch (type) {
      case BenchmarkLabelType.WORST:
        return {
          backgroundColor: '#D494C1',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.WORSE:
        return {
          backgroundColor: '#BC6AAA',
          color: 'var(--other-black, #0B0C0C)',
        };
      case BenchmarkLabelType.MIDDLE:
        return {
          backgroundColor: '#A44596',
          color: 'var(--other-white, #FFF)',
        };
      case BenchmarkLabelType.BETTER:
        return {
          backgroundColor: '#812972',
          color: 'var(--other-white, #FFF)',
        };
      default:
        return {
          backgroundColor: '#561950',
          color: 'var(--other-white, #FFF)',
        };
    }
  }
};



export const BenchmarkLabelStyle = styled(Label)<{
  legendType: BenchmarkLabelType;
  group: BenchmarkLabelGroupType;
}>(({ legendType, group }) => {
  const theme = getBenchmarkLabelStyle(group, legendType);
  return {
    display: 'inline-block',
    padding: '5px 8px 4px 8px',
    alignItems: 'center',
    fontSize: '12px',
    fontStyle: 'normal',
    fontWeight: '300',
    lineHeight: '16px',
    letterSpacing: '1px',
    margin: '0.5px',
    fontFamily: 'GDS Transport',
    ...theme,
  };
});

export const BenchmarkLabel: React.FC<BenchmarkLabelProps> = ({
  label,
  type,
  group,
}) => {
  const legendType = type as BenchmarkLabelType?? BenchmarkLabelType.NOT_COMPARED;
  const groupType =  group as BenchmarkLabelGroupType ?? BenchmarkLabelGroupType.RAG;
  
  return (
    <BenchmarkLabelStyle legendType={legendType} group={groupType}>
      <Label>{label}</Label>
    </BenchmarkLabelStyle>
  );
};
