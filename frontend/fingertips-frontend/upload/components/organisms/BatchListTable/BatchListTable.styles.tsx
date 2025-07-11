import styled from 'styled-components';
import { Table } from 'govuk-react';

export const StyledTable = styled(Table)({
  borderSpacing: '5px 5px',
  borderCollapse: 'separate',
});

export const StyledTableCell = styled(Table.Cell)({
  border: '1px solid black',
});

export const StyledTableCellHeader = styled(Table.CellHeader)({
  border: 'none',
  verticalAlign: 'top',
});

export const StyledButtonTableCell = styled(Table.Cell)({
  border: 'none',
});
