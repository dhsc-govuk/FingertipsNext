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
import {
  paddingSize,
  spineChartIndicatorTitleColumnMinWidth,
  spineChartPeriodColumnMinWidth,
} from './spineChartTableHelpers';

export const StyledTable = styled(Table)({
  borderCollapse: 'collapse',
});

export const StyledDivTableContainer = styled.div({
  overflowX: 'scroll',
  maxWidth: '960px',
});

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 10,
  paddingRight: '0.5em',
};

export const StyledStickyEmptyLeftHeader = styled(Table.CellHeader)(
  stickyLeft as unknown as TemplateStringsArray
);

export const StyledAlignCentreHeader = styled(StyledAlignLeftHeader)({
  textAlign: 'center',
});

export const StyledAlignRightHeaderPadLeft = styled(StyledAlignRightHeader)({
  paddingLeft: '0.5em',
});

export const StyledAlignRightBorderHeader = styled(StyledAlignRightHeader)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
});

export const StyledAlignLeftStickyLeftHeader = styled(StyledAlignLeftHeader)(
  stickyLeft as unknown as TemplateStringsArray
);

export const StickyValueUnitHeader = styled(StyledAlignRightBorderHeader)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  left: `${spineChartIndicatorTitleColumnMinWidth + spineChartPeriodColumnMinWidth + paddingSize * 2}px`,
});

export const StickyPeriodHeader = styled(StyledAlignCentreHeader)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  minWidth: `${spineChartPeriodColumnMinWidth}px}`,
  left: `${spineChartIndicatorTitleColumnMinWidth + paddingSize}px`,
});

export const StyledAlignCentreTableCell = styled(StyledAlignLeftTableCell)({
  textAlign: 'center',
});

export const StyledAlignRightBorderRightTableCell = styled(
  StyledAlignRightTableCell
)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
});

export const StyledAlignRightCellPadLeft = styled(StyledAlignRightTableCell)({
  paddingLeft: '0.5em',
});

export const StyledValueUnitStickyCell = styled(
  StyledAlignRightBorderRightTableCell
)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  left: `${spineChartIndicatorTitleColumnMinWidth + spineChartPeriodColumnMinWidth + paddingSize * 2}px`,
});

export const StyledPeriodStickyCell = styled(StyledAlignCentreTableCell)({
  ...(stickyLeft as unknown as TemplateStringsArray),
  width: `${spineChartPeriodColumnMinWidth}px}`,
  left: `${spineChartIndicatorTitleColumnMinWidth + paddingSize}px`,
});

export const StyledIndicatorTitleStickyLeftCell = styled(
  StyledIndicatorTitleCell
)(stickyLeft as unknown as TemplateStringsArray);

export const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
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
  paddingLeft: '0.5em',
});

export const StyledBenchmarkCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
  paddingLeft: '0.5em',
});

export const StyledBenchmarkChart = styled(StyledBenchmarkCell)({
  backgroundColor: GovukColours.White,
  minWidth: 200,
});
