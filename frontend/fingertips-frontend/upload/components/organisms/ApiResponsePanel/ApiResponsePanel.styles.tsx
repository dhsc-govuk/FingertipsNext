import { Table } from 'govuk-react';
import styled from 'styled-components';

export const ResponsePanel = styled('div')({
  marginBottom: '50px',
  borderColor: '#1D70B8',
  borderWidth: '5px',
  borderStyle: 'solid',
  padding: '15px',
});

export const WrappedCell = styled(Table.Cell)({ overflowWrap: 'anywhere' });
