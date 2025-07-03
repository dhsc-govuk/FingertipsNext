import styled from 'styled-components';
import { Link } from 'govuk-react';

export const StyledRightClearAllLink = styled(Link)({
  display: 'flex',
  justifyContent: 'flex-end',
  fontSize: '19px',
});

export const StyledFilterWithClearAllLink = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  whiteSpace: 'nowrap',
});
