'use client';
import { Tag } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';
import {
  GovukColours,
  GovukColourVars,
  QuintileColours,
} from '@/lib/styleHelpers/colours';

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
  type?: BenchmarkLabelType | string;
  group?: BenchmarkLabelGroupType | string;
}

export const getDefaultBenchmarkTagStyle = (
  group: BenchmarkLabelGroupType,
  type: BenchmarkLabelType
) => {
  switch (group) {
    case BenchmarkLabelGroupType.RAG: {
      switch (type) {
        case BenchmarkLabelType.BETTER:
          return {
            backgroundColor: GovukColourVars.GovOtherGreen,
          };
        case BenchmarkLabelType.SIMILAR:
          return {
            backgroundColor: GovukColourVars.GovOtherYellow,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.WORSE:
          return {
            backgroundColor: GovukColourVars.GovOtherRed,
          };
        case BenchmarkLabelType.LOWER:
          return {
            backgroundColor: GovukColourVars.GovOtherLightBlue,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.HIGHER:
          return {
            backgroundColor: GovukColours.DarkBlue,
          };
        default:
          return {
            backgroundColor: 'transparent',
            color: GovukColours.Black,
            border: '1px solid #0B0C0C',
          };
      }
    }
    case BenchmarkLabelGroupType.QUINTILES: {
      switch (type) {
        case BenchmarkLabelType.LOWEST:
          return {
            backgroundColor: QuintileColours.Lowest,
            color: GovukColourVars.GovOtherBlack,
          };

        case BenchmarkLabelType.LOW:
          return {
            backgroundColor: QuintileColours.Low,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.MIDDLE:
          return {
            backgroundColor: QuintileColours.Middle,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.HIGH:
          return {
            backgroundColor: QuintileColours.High,
          };
        default:
          return {
            backgroundColor: QuintileColours.Highest,
          };
      }
    }
    case BenchmarkLabelGroupType.QUINTILES_WITH_VALUE: {
      switch (type) {
        case BenchmarkLabelType.WORST:
          return {
            backgroundColor: QuintileColours.Worst,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.WORSE:
          return {
            backgroundColor: QuintileColours.Worse,
            color: GovukColourVars.GovOtherBlack,
          };
        case BenchmarkLabelType.MIDDLE:
          return {
            backgroundColor: QuintileColours.MiddleWithValue,
          };
        case BenchmarkLabelType.BETTER:
          return {
            backgroundColor: QuintileColours.Better,
          };
        default:
          return {
            backgroundColor: QuintileColours.Best,
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
    padding: '5px 8px 4px 8px',
    alignItems: 'center',
    margin: '0.3125em',
    fontWeight: '300',
    textTransform: 'unset',
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
    case BenchmarkLabelGroupType.QUINTILES_WITH_VALUE: {
      const value = type.toLowerCase();
      return value[0].toUpperCase() + value.slice(1);
    }
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
