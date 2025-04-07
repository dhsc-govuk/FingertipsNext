import { Table } from 'govuk-react';
import styled from 'styled-components';
import { typography } from '@govuk-react/lib';
import { GovukColours } from '../styleHelpers/colours';
import { formatNumber } from '@/lib/numberFormatter';

export const StyledTableCellHeader = styled(Table.CellHeader)(
  typography.font({ size: 16 }),
  {
    fontWeight: 'bold',
    padding: '0.625em 0',
  }
);

export const StyledAlignRightHeader = styled(StyledTableCellHeader)({
  textAlign: 'right',
  paddingRight: '10px',
  verticalAlign: 'top',
});

export const StyledGreyHeader = styled(StyledAlignRightHeader)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: `solid #F3F2F1 2px`,
  verticalAlign: 'top',
});

export const StyledTableCell = styled(Table.Cell)(
  typography.font({ size: 16 }),
  {
    paddingRight: '0',
  }
);

export const StyledAlignRightTableCell = styled(StyledTableCell)({
  textAlign: 'right',
  paddingRight: '10px',
});

export const StyledGreyTableCellValue = styled(StyledAlignRightTableCell)({
  backgroundColor: GovukColours.MidGrey,
  borderTop: `solid #F3F2F1 2px`,
});

export const StyledAlignLeftTableCell = styled(StyledTableCell)({
  textAlign: 'left',
  width: '10%',
});

export const StyledAlignLeftHeader = styled(StyledTableCellHeader)({
  textAlign: 'left',
  verticalAlign: 'top',
});

export const StyledDiv = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const StyledDivWithScrolling = styled('div')({
  overflowX: 'auto',
  width: '100%',
});

// When value is undefined, it returns an X with an aria-label for screen readers.
export const convertToPercentage = (value?: number) => {
  return value
    ? `${formatNumber((value / 10000) * 100)}%`
    : getNonAvailablePlaceHolder();
};

export const getDisplayValue = (value?: number) => {
  return value ? formatNumber(value) : getNonAvailablePlaceHolder();
};

export const getNonAvailablePlaceHolder = () => {
  return (
    <span aria-label="Not available" data-testid="not-available">
      <span aria-hidden="true">X</span>
    </span>
  );
};
