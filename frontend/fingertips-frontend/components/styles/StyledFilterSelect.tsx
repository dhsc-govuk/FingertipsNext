import styled from 'styled-components';
import { Select } from 'govuk-react';

export const StyledFilterSelect = styled(Select)({
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
  marginBottom: '2em',
});
