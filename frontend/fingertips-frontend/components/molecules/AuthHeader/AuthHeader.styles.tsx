import styled from 'styled-components';

export const PositionWrapper = styled.div({
  display: 'flex',
  width: '100%',
  justifyContent: 'center',
  pointerEvents: 'none',
});

export const PositionWrapperInner = styled.div({
  position: 'absolute',
  width: 'calc(100% - 60px)',
  maxWidth: '960px',
  pointerEvents: 'none',
  margin: '0 auto',
});

export const Content = styled.div({
  display: 'block',
  width: 'fit-content',
  height: '100%',
  margin: '0 0 0 auto',
  padding: '8px 0 8px 8px',
  pointerEvents: 'auto',
});
