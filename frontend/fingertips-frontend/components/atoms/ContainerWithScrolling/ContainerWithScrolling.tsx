import styled from 'styled-components';

interface ScrollProps {
  horizontal?: boolean;
  vertical?: boolean;
}

export const ContainerWithScrolling = styled.div<ScrollProps>(
  ({ horizontal, vertical }) => ({
    overflowX: horizontal ? 'auto' : 'hidden',
    overflowY: vertical ? 'auto' : 'hidden',
  })
);
