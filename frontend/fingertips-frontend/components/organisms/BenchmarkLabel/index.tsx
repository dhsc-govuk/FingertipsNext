'use client';
import { Tag } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';
import { getDefaultBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
import {
  BenchmarkLabelGroupType,
  BenchmarkLabelType,
} from '@/components/organisms/BenchmarkLabel/BenchmarkLabelTypes';

interface BenchmarkLabelProps {
  type?: BenchmarkLabelType | string;
  group?: BenchmarkLabelGroupType | string;
}

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
          return 'Better';
        case BenchmarkLabelType.SIMILAR:
          return 'Similar';
        case BenchmarkLabelType.WORSE:
          return 'Worse';
        case BenchmarkLabelType.LOWER:
          return 'Lower';
        case BenchmarkLabelType.HIGHER:
          return 'Higher';
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
