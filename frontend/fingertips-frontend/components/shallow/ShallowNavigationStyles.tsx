import styled from 'styled-components';
import { TagColours } from '@/lib/styleHelpers/colours';

export const DivFlexColumn = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  padding: '1.5rem 1rem',
  backgroundColor: TagColours.GreyBackground,
  width: '300px',
  boxSizing: 'border-box',
  flex: 'none',
});

export const DivSelects = styled.div({
  display: 'flex',
  flexDirection: 'column',
  gap: '1rem',
  span: {
    fontWeight: 'bold',
  },
  select: {
    width: '100%',
  },
});

export const DivFlexRow = styled.div({
  display: 'flex',
  gap: '1rem',
});

export const DivContent = styled.div({
  flexGrow: '1',
});
