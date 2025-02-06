'use client';
import { Label } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';

export const enum LegendLabelType {
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

export const enum LegendLabelGroupType {
  RAG = 'rag',
  QUINTILE = 'quintile',
  OTHERS = 'others',
}

export interface LegendLabelProps {
  label?: string;
  type?: LegendLabelType | string;
  group?: LegendLabelGroupType | string;
}

export const getBenchmarkLegendColourStyle = (
  group: LegendLabelGroupType = LegendLabelGroupType.OTHERS,
  type: LegendLabelType
) => {
  if (group === LegendLabelGroupType.RAG) {
    switch (type) {
      case LegendLabelType.HIGH:
        return {
          backgroundColor: 'var(--other-dark-blue, #003078)',
          color: 'var(--other-white, #FFF)',
        };
      case LegendLabelType.LOWER:
        return {
          backgroundColor: 'var(--other-light-blue, #5694CA)',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.BETTER:
        return {
          backgroundColor: 'var(--other-green, #00703C)',
          color: 'var(--other-white, #FFF)',
        };
      case LegendLabelType.SIMILAR:
        return {
          backgroundColor: 'var(--other-yellow, #FD0)',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.WORSE:
        return {
          backgroundColor: 'var(--other-red, #D4351C)',
          color: 'var(--other-white, #FFF)',
        };
      case LegendLabelType.HIGHER:
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

  if (group === LegendLabelGroupType.QUINTILE) {
    switch (type) {
      case LegendLabelType.LOWEST:
        return {
          backgroundColor: '#E4DDFF',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.LOW:
        return {
          backgroundColor: '#CBBEF4',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.MIDDLE:
        return {
          backgroundColor: '#AA90EC',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.HIGH:
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

  if (group === LegendLabelGroupType.OTHERS) {
    switch (type) {
      case LegendLabelType.WORST:
        return {
          backgroundColor: '#D494C1',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.WORSE:
        return {
          backgroundColor: '#BC6AAA',
          color: 'var(--other-black, #0B0C0C)',
        };
      case LegendLabelType.MIDDLE:
        return {
          backgroundColor: '#A44596',
          color: 'var(--other-white, #FFF)',
        };
      case LegendLabelType.BETTER:
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

export const LegendLabelStyle = styled(Label)<{
  legendType: LegendLabelType;
  group: LegendLabelGroupType;
}>(({ legendType, group }) => {
  const theme = getBenchmarkLegendColourStyle(group, legendType);
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

export const LegendLabel: React.FC<LegendLabelProps> = ({
  label,
  type,
  group,
}) => {
  const legendType = (type as LegendLabelType) ?? LegendLabelType.NOT_COMPARED;
  const groupType = (group as LegendLabelGroupType) ?? LegendLabelGroupType.RAG;

  return (
    <LegendLabelStyle legendType={legendType} group={groupType}>
      <Label>{label}</Label>
    </LegendLabelStyle>
  );
};
