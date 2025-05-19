import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
  StyledAlignRightTableCell,
  StyledGreyHeader,
  StyledIndicatorTitleCell,
} from '@/lib/tableHelpers';
import { Table } from 'govuk-react';

export const StyledTableOneArea = styled(Table)({
  borderCollapse: 'collapse',
});

export const StyledTableMultipleAreas = styled(Table)({
  borderCollapse: 'separate',
});

export const StyledDivTableContainer = styled.div({
  overflowX: 'scroll',
  maxWidth: '960px',
});

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 2,
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  fontSize: 19,
};

export const StyledStickyEmptyLeftHeader = styled(Table.CellHeader)(
  stickyLeft as unknown as TemplateStringsArray
);

export const StyledAlignCentreHeader = styled(StyledAlignLeftHeader)({
  textAlign: 'center',
  fontSize: 19,
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
});

export const StyledAlignRightHeaderPad = styled(StyledAlignRightHeader)({
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  fontSize: 19,
});

export const StyledAlignRightBorderHeader = styled(StyledAlignRightHeader)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
  textAlign: 'center',
  fontSize: 19,
});

export const StyledAlignLeftHeaderRightBorder = styled(StyledAlignLeftHeader)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
  textAlign: 'left',
  fontSize: 19,
});

export const StyledAlignLeftStickyLeftHeader = styled(StyledAlignLeftHeader)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  borderRight: 'solid #bfc1c3 1px',
});

export const StyledAlignCentreTableCell = styled(StyledAlignLeftTableCell)({
  textAlign: 'center',
  fontSize: 19,
});

export const StyledAlignRightTableCellPaddingRight = styled(
  StyledAlignLeftTableCell
)({
  textAlign: 'right',
  paddingRight: '0.5em',
});

export const StyledAlignLeftTableCellPaddingLeft = styled(
  StyledAlignLeftTableCell
)({
  borderRight: 'solid #bfc1c3 1px',
  paddingLeft: '0.5em',
});

export const StyledAlignRightBorderRightTableCell = styled(
  StyledAlignRightTableCell
)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
  fontSize: 19,
});

export const StyledAlignCentreBorderRightTableCell = styled(
  StyledAlignCentreTableCell
)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
  fontSize: 19,
});

export const StyledAlignLeftBorderRightTableCell = styled(
  StyledAlignLeftTableCell
)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
  fontSize: 19,
});

export const StyledAlignRightCellPadLeft = styled(StyledAlignRightTableCell)({
  paddingLeft: '0.5em',
  fontSize: 19,
});

export const StyledIndicatorTitleStickyLeftCell = styled(
  StyledIndicatorTitleCell
)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
});

export const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
  fontSize: 19,
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
});

export const StyledGroupSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
  fontSize: 19,
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
});

export const StyledBenchmarkHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'center',
  paddingLeft: '0.5em',
  paddingRight: '0.5em',
  fontSize: 19,
});

export const StyledBenchmarkSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  fontSize: 19,
  textAlign: 'right',
  paddingLeft: '0.5em',
  paddingRight: '0.5em !important', // overrides the :last-child declaration which removes right padding
});

export const StyledGroupCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
  paddingLeft: '0.5em',
  fontSize: 19,
});

export const StyledBenchmarkCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
  fontSize: 19,
  paddingLeft: '0.5em',
  paddingRight: '0.5em !important', // overrides the :last-child declaration which removes right padding
});

export const StyledBenchmarkChart = styled(StyledBenchmarkCell)({
  backgroundColor: GovukColours.White,
  minWidth: 200,
});
