import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const ModalPaneContainer = styled.div({
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  zIndex: 1000,
});

export const ModalPaneOverlay = styled.div({
  position: 'absolute',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: `rgba(255, 255, 255, 0.75)`,
  pointerEvents: 'auto',
});

export const ModalPaneInner = styled.div({
  position: 'absolute',
  top: '200px',
  left: 'calc(50vw - 370px)',
  width: '740px',
  backgroundColor: GovukColours.White,
  border: `1px solid ${GovukColours.Black}`,
  padding: '16px',
});

export const ModalPaneBlankButton = styled.button({
  appearance: 'none',
  padding: '8px',
  border: 'none',
  backgroundColor: 'transparent',
  position: 'absolute',
  top: 0,
  right: 0,
});
