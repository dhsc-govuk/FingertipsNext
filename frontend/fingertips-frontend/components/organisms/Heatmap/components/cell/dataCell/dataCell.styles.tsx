import { Table } from 'govuk-react';
import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const NumericCell = styled(Table.Cell)({
  textAlign: 'center',
  padding: 0,
  position: 'relative',
  borderLeft: `1px solid #bfc1c3`,
  verticalAlign: 'middle',
});

export const DataTableCell = styled(NumericCell)<{
  $color?: string;
  $backgroundColor?: string;
}>`
  color: ${(props) => props.$color ?? GovukColours.Black};
  background-color: ${(props) => props.$backgroundColor ?? GovukColours.White};
`;

export const DataCellContent = styled.div({
  margin: '2px',
  padding: '10px',
  minWidth: '40px',
  maxWidth: '120px',
  minHeight: '2em',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});
