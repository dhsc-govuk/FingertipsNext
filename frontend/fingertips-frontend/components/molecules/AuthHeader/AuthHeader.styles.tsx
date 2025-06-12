import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

export const PositionWrapper = styled.div({
  position: 'absolute',
  width: '100%',
});

export const Content = styled.ul({
  display: 'block',
  width: 'fit-content',
  height: '100%',
  marginTop: 0,
  marginBottom: 0,
  marginLeft: 'auto',
  marginRight: '0',
  padding: '8px',
  paddingRight: '16px',
});

export const ContentItem = styled.li({
  height: '39px',
  paddingLeft: '30px',
  marginRight: '20px',
  borderLeft: `1px solid ${GovukColours.MidGrey}`,
  display: 'inline-block',
  verticalAlign: 'middle',
});
