import styled from 'styled-components';
import { Table } from 'govuk-react';

export const StyledTable = styled(Table)({
  borderSpacing: '16px 10px',
  borderCollapse: 'separate',
  background: '#fff',
});

export const StyledTableCell = styled(Table.Cell)({
  border: '1px solid #222',
  padding: '8px 16px',
  fontSize: '16px',
});

export const StyledTableCellHeader = styled(Table.CellHeader)({
  border: 'none',
  background: '#fff',
  fontWeight: 700,
  fontSize: '16px',
  verticalAlign: 'top',
});

export const StyledButtonTableCell = styled(Table.Cell)({
  border: 'none',
  padding: '8px 16px',
  textAlign: 'right',
});
