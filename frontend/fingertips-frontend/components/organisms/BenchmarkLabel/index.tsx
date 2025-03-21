'use client';
import { Tag } from 'govuk-react';
import styled from 'styled-components';
import React from 'react';
import { getBenchmarkTagStyle } from '@/components/organisms/BenchmarkLabel/BenchmarkLabelConfig';
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
  const theme = getBenchmarkTagStyle(group, legendType);
  return {
    padding: '5px 8px 4px 8px',
    alignItems: 'center',
    margin: '0.3125em',
    fontWeight: '300',
    textTransform: 'unset',
    ...theme,
  };
});

const getBenchmarkLabelText = (type: BenchmarkLabelType) => {
  const validTypes = Object.values(BenchmarkLabelType);
  return validTypes.includes(type) ? type : 'Not compared';
};

export const BenchmarkLabel: React.FC<BenchmarkLabelProps> = ({
  type,
  group,
}) => {
  const legendType =
    (type as BenchmarkLabelType) ?? BenchmarkLabelType.NOT_COMPARED;
  const groupType =
    (group?.toLowerCase() as BenchmarkLabelGroupType) ??
    BenchmarkLabelGroupType.RAG;
  const labelText = getBenchmarkLabelText(legendType);
  return (
    <BenchmarkTagStyle legendType={legendType} group={groupType}>
      {labelText}
    </BenchmarkTagStyle>
  );
};
