'use client';
import { Tag } from 'govuk-react';
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

interface BenchmarkLabelProps {
  label?: string;
  type?: BenchmarkLabelType | string;
  group?: BenchmarkLabelGroupType | string;
}

export const getDefaultBenchmarkTagStyle = (
  group: BenchmarkLabelGroupType = BenchmarkLabelGroupType.QUINTILES_WITH_VALUE,
  type: BenchmarkLabelType
) => {
  switch (group) {
    case BenchmarkLabelGroupType.RAG: {
      switch (type) {
        case BenchmarkLabelType.BETTER:
          return {
            backgroundColor: 'var(--other-green, #00703C)',
            tint: 'SOLID',
          };
        case BenchmarkLabelType.SIMILAR:
          return {
            backgroundColor: 'var(--other-yellow, #FD0)',
            color: 'var(--other-black, #0B0C0C)',
          };
        case BenchmarkLabelType.WORSE:
          return {
            backgroundColor: 'var(--other-red, #D4351C)',
            tint: 'SOLID',
          };
        case BenchmarkLabelType.LOWER:
          return {
            backgroundColor: 'var(--other-light-blue, #5694CA)',
            color: 'var(--other-black, #0B0C0C)',
          };
        case BenchmarkLabelType.HIGHER:
          return {
            backgroundColor: 'var(--other-dark-blue, #003078)',
            tint: 'SOLID',
          };
        default:
          return {
            backgroundColor: 'transparent',
            color: 'var(--other-black, #0B0C0C)',
          };
      }
    }
    case BenchmarkLabelGroupType.QUINTILES: {
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
            tint: 'SOLID',
          };
        default:
          return {
            backgroundColor: '#6B33C3',
            tint: 'SOLID',
          };
      }
    }
    case BenchmarkLabelGroupType.QUINTILES_WITH_VALUE: {
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
            tint: 'SOLID',
          };
        case BenchmarkLabelType.BETTER:
          return {
            backgroundColor: '#812972',
            tint: 'SOLID',
          };
        default:
          return {
            backgroundColor: '#561950',
            tint: 'SOLID',
          };
      }
    }
  }
};

export const BenchmarkTagStyle = styled(Tag)<{
  legendType: BenchmarkLabelType;
  group: BenchmarkLabelGroupType;
}>(({ legendType, group }) => {
  const theme = getDefaultBenchmarkTagStyle(group, legendType);
  return {
    display: 'inline-block',
    padding: '5px 8px 4px 8px',
    alignItems: 'center',
    fontSize: '12px',
    fontWeight: '300',
    fontStyle: 'normal',
    lineHeight: '16px',
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
    <BenchmarkTagStyle legendType={legendType} group={groupType}>
      {label}
    </BenchmarkTagStyle>
  );
};
