import styled from 'styled-components';
import { GovukColours } from '@/lib/styleHelpers/colours';

export const ExportPreviewCanvasDiv = styled.div({
  borderWidth: '1px',
  borderStyle: 'solid',
  borderColor: GovukColours.MidGrey,
  margin: '1rem 0',
  maxHeight: '50vh',
  overflow: 'auto',
  svg: {
    width: '100%',
    height: 'auto',
  },
});

export const FlexDiv = styled.div({
  display: 'flex',
  gap: '1rem',
});
