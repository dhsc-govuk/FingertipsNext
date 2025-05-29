import React, { FC } from 'react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import {
  StyledAlignLeftHeader,
  StyledAlignRightTableCell,
  StyledGreyHeader,
  StyledStickyRight,
  StyledStickyRightHeader,
} from '@/lib/tableHelpers';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const StyledAreaNameHeader = styled(StyledAlignLeftHeader)({
  borderTop: `solid ${GovukColours.LightGrey} 2px`, // aligns top to match grey heading cells
  textAlign: 'center',
});

const StyledGroupValueTableCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderLeft: `solid black 1px`,
});

const StyledLightGreyHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
});

const StyledGroupNameHeader = styled(StyledAreaNameHeader)({
  background: GovukColours.LightGrey,
  paddingRight: '0.5em',
  paddingLeft: '0.5em',
  textAlign: 'right',
  verticalAlign: 'top',
});

const StyledLightGreySubHeader = styled(StyledLightGreyHeader)({
  borderLeft: 'solid black 1px',
  paddingLeft: '0.5em',
  width: '16%',
});

const StyledAlternateEnglandHeader = styled(StyledStickyRightHeader)({
  backgroundColor: GovukColours.LightGrey,
  verticalAlign: 'top',
});

const StyledAlternateGroupHeader = styled(StyledGroupNameHeader)({
  backgroundColor: GovukColours.MidGrey,
});

const StyledAlternateGroupSubHeader = styled(StyledLightGreySubHeader)({
  borderTop: `solid ${GovukColours.LightGrey} 2px`,
  backgroundColor: GovukColours.MidGrey,
});

const StyledAlternateGroupBenchmarkCell = styled(StyledGroupValueTableCell)({
  borderTop: `solid ${GovukColours.LightGrey} 2px`,
  backgroundColor: GovukColours.MidGrey,
});

const StyledAlternateEnglandBenchmarkCell = styled(StyledStickyRight)({
  backgroundColor: GovukColours.LightGrey,
});

interface AlternateBenchmarkCellProps {
  children?: React.ReactNode;
  benchmarkToUse: string | undefined;
  label: 'group' | 'benchmark';
  cellType?: 'group' | 'england';
}

export const BenchmarkingHeaderCellWrapper: FC<AlternateBenchmarkCellProps> = ({
  children,
  benchmarkToUse = areaCodeForEngland,
  label,
  cellType,
}) => {
  let CellWrapper: React.ComponentType<{ children?: React.ReactNode }>;
  if (label === 'group') {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateGroupHeader
        : StyledGroupNameHeader;
  } else {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateEnglandHeader
        : StyledStickyRightHeader;
  }
  return (
    <CellWrapper data-testid={`${cellType}-header`}>{children}</CellWrapper>
  );
};

export const BenchmarkingSubHeaderCellWrapper: FC<
  AlternateBenchmarkCellProps
> = ({ children, benchmarkToUse = areaCodeForEngland, label, cellType }) => {
  let CellWrapper: React.ComponentType<{ children?: React.ReactNode }>;
  if (label === 'group') {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateGroupSubHeader
        : StyledLightGreySubHeader;
  } else {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateEnglandHeader
        : StyledStickyRightHeader;
  }
  return (
    <CellWrapper data-testid={`${cellType}-subheader`}>{children}</CellWrapper>
  );
};

export const BenchmarkingCellWrapper: FC<AlternateBenchmarkCellProps> = ({
  children,
  benchmarkToUse = areaCodeForEngland,
  label,
  cellType,
}) => {
  let CellWrapper: React.ComponentType<{ children?: React.ReactNode }>;
  if (label === 'group') {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateGroupBenchmarkCell
        : StyledGroupValueTableCell;
  } else {
    CellWrapper =
      benchmarkToUse !== areaCodeForEngland
        ? StyledAlternateEnglandBenchmarkCell
        : StyledStickyRight;
  }
  return <CellWrapper data-testid={`${cellType}-cell`}>{children}</CellWrapper>;
};
