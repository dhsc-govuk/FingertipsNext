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
  QUINTILES_WITH_VALUE = 'quintiles_wv',
}

export interface BenchmarkLabelProps {
  label?: string;
  type?: BenchmarkLabelType | string;
  group?: BenchmarkLabelGroupType | string;
}

export const getLabelValueFromType = (type: string) => {
  return `type =${type}`;
};

export const getBenchmarkLabelStyle = (
  group: BenchmarkLabelGroupType = BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
  type: BenchmarkLabelType
) => {
  const styles = {
    [BenchmarkLabelGroupType.RAG]: {
      [BenchmarkLabelType.BETTER]: {
        backgroundColor: 'var(--other-green, #00703C)',
        color: 'var(--other-white, #FFF)',
      },
      [BenchmarkLabelType.SIMILAR]: {
        backgroundColor: 'var(--other-yellow, #FD0)',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.WORSE]: {
        backgroundColor: 'var(--other-red, #D4351C)',
        color: 'var(--other-white, #FFF)',
      },
      [BenchmarkLabelType.LOWER]: {
        backgroundColor: 'var(--other-light-blue, #5694CA)',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.HIGHER]: {
        backgroundColor: 'var(--other-dark-blue, #003078)',
        color: 'var(--other-white, #FFF)',
      },
    },
    [BenchmarkLabelGroupType.QUINTILES]: {
      [BenchmarkLabelType.LOWEST]: {
        backgroundColor: '#E4DDFF',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.LOW]: {
        backgroundColor: '#CBBEF4',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.MIDDLE]: {
        backgroundColor: '#AA90EC',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.HIGH]: {
        backgroundColor: '#8B60E2',
        color: 'var(--other-white, #FFF)',
      },
      [BenchmarkLabelType.HIGHEST]: {
        backgroundColor: '#6B33C3',
        color: 'var(--other-white, #FFF)',
      },
    },
    [BenchmarkLabelGroupType.QUINTILES_WITH_VALUE]: {
      [BenchmarkLabelType.WORST]: {
        backgroundColor: '#D494C1',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.WORSE]: {
        backgroundColor: '#BC6AAA',
        color: 'var(--other-black, #0B0C0C)',
      },
      [BenchmarkLabelType.MIDDLE]: {
        backgroundColor: '#A44596',
        color: 'var(--other-white, #FFF)',
      },
      [BenchmarkLabelType.BETTER]: {
        backgroundColor: '#812972',
        color: 'var(--other-white, #FFF)',
      },
      [BenchmarkLabelType.BEST]: {
        backgroundColor: '#561950',
        color: 'var(--other-white, #FFF)',
      },
    },
  };

  return (
    styles[group]?.[type] || {
      backgroundColor: 'transparent',
      color: 'var(--other-black, #0B0C0C)',
      border: '1px solid #000',
    }
  );
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
    lineHeight: '16px',
    letterSpacing: '1px',
    margin: '0.0225em',
    ...theme,
  };
});

const getBenchmarkLabel = (
  type: BenchmarkLabelType,
  group: BenchmarkLabelGroupType
) => {
  switch (group) {
    case BenchmarkLabelGroupType.RAG:
      switch (type) {
        case BenchmarkLabelType.BETTER:
          return 'Better (95%)';
        case BenchmarkLabelType.SIMILAR:
          return 'Similar';
        case BenchmarkLabelType.WORSE:
          return 'Worse (95%)';
        case BenchmarkLabelType.LOWER:
          return 'Lower (95%)';
        case BenchmarkLabelType.HIGHER:
          return 'Higher (95%)';
        default:
          return 'Not compared';
      }

    case BenchmarkLabelGroupType.QUINTILES:
    case BenchmarkLabelGroupType.QUINTILES_WITH_VALUE:
      const typeValue = type.toLowerCase();
      return typeValue[0].toUpperCase() + typeValue.slice(1);
    default:
      return '';
  }
};

export const BenchmarkLabel: React.FC<BenchmarkLabelProps> = ({
  type,
  group,
}) => {
  const legendType =
    (type as BenchmarkLabelType) ?? BenchmarkLabelType.NOT_COMPARED;
  const groupType =
    (group as BenchmarkLabelGroupType) ?? BenchmarkLabelGroupType.RAG;
  const label = getBenchmarkLabel(legendType, groupType);
  return (
    <BenchmarkLabelStyle legendType={legendType} group={groupType}>
      <Label>{label}</Label>
    </BenchmarkLabelStyle>
  );
};
