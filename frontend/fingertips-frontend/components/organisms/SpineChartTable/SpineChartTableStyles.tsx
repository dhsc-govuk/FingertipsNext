import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightTableCell,
  StyledGreyHeader,
} from '@/lib/tableHelpers';
import { Table } from 'govuk-react';

export const StyledTable = styled(Table)({
  display: 'block',
  width: '100%',
  tableLayout: 'fixed',
});

export const StyledDivTableContainer = styled.div({
  overflowX: 'scroll',
});

export const StyledAlignCentreHeader = styled(StyledAlignLeftHeader)({
  textAlign: 'center',
});

export const StyledAlignCentreTableCell = styled(StyledAlignLeftTableCell)({
  textAlign: 'center',
});

export const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'left',
});

export const StyledGroupSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
});

export const StyledBenchmarkHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'center',
});

export const StyledBenchmarkSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
});

export const StyledGroupCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
});

export const StyledBenchmarkCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
});

export const StyledBenchmarkChart = styled(StyledBenchmarkCell)({
  minWidth: 200
});