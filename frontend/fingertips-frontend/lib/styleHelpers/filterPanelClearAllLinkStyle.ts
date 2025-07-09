import styled from 'styled-components';
import { Link } from 'govuk-react';

export const StyledRightClearAllLink = styled(Link)<{ $enabled: boolean }>(
  ({ $enabled }) => ({
    fontSize: '19px',
    pointerEvents: $enabled ? 'none' : 'auto',
    whiteSpace: 'nowrap',
  })
);

export const StyledFilterWithClearAllLink = styled('div')`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (min-width: 641px) and (max-width: 807px) {
    display: block;
  }
`;
