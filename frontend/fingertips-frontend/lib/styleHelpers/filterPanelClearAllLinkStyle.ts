import styled from 'styled-components';
import { Link } from 'govuk-react';

export const StyledRightClearAllLink = styled(Link)<{ $enabled: boolean }>(
  ({ $enabled }) => ({
    display: 'flex',
    justifyContent: 'flex-end',
    fontSize: '19px',
    pointerEvents: $enabled ? 'none' : 'auto',
  })
);

export const StyledFilterWithClearAllLink = styled('div')({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  whiteSpace: 'nowrap',
});
