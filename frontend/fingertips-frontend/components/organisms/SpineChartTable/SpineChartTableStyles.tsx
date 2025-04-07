import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';
import {
  StyledAlignLeftHeader,
  StyledAlignLeftTableCell,
  StyledAlignRightHeader,
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

const stickyLeft = {
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 10,
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em'
};

const stickyRight = {
  position: 'sticky',
  right: 0,
  zIndex: 10,
  paddingLeft: '0.5em',
  paddingRight: '0.5em !important', // overrides the :last-child declaration which removes right padding
};

export const StyledStickyEmptyLeftHeader = styled(Table.CellHeader)({
  background: 'white',
  position: 'sticky',
  left: 0,
  zIndex: 10,
  paddingRight: '0.5em',
});

export const StyledAlignCentreHeader = styled(StyledAlignLeftHeader)({
  textAlign: 'center'
});

export const StyledAlignCentreStickyLeftHeader = styled(StyledAlignCentreHeader)(
  stickyLeft as unknown as TemplateStringsArray
);

export const StyledAlignRightBorderHeader = styled(StyledAlignRightHeader)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
});

export const StyledAlignCentreTableCell = styled(StyledAlignLeftTableCell)({
  textAlign: 'center',
});

export const StyledAlignRightBorderRightTableCell = styled(StyledAlignRightTableCell)({
  borderRight: 'solid #bfc1c3 1px',
  paddingRight: '0.5em',
});

export const StyledAlignCentreStickyTableCell = styled(StyledAlignCentreTableCell)(
  stickyLeft as unknown as TemplateStringsArray
);

export const StyledGroupHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'left',
});

export const StyledGroupStickyRightHeader = styled(StyledGroupHeader)(
  stickyRight as unknown as TemplateStringsArray
);

export const StyledGroupSubHeader = styled(StyledGreyHeader)({
  backgroundColor: GovukColours.LightGrey,
  borderTop: GovukColours.MidGrey,
  textAlign: 'right',
});

export const StyledGroupStickyRightSubHeader = styled(StyledGroupSubHeader)(
  stickyRight as unknown as TemplateStringsArray
);

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

export const StyledStickyRightGroupCell = styled(StyledGroupCell)(
  stickyRight as unknown as TemplateStringsArray
);

export const StyledBenchmarkCell = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: GovukColours.LightGrey,
  textAlign: 'right',
});

export const StyledBenchmarkChart = styled(StyledBenchmarkCell)({
  backgroundColor: GovukColours.White,
  minWidth: 200,
});
