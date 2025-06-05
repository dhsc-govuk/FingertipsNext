import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';

export const StyledHoverWrapper = styled.div({
  marginBlock: '10px',
  textWrap: 'wrap',
});

export const StyledYearParagraph = styled.p({ marginBlock: '0px' });

export const StyledDataWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
});

export const StyledSymbolDiv = styled.div<{ colour: GovukColours }>`
  color: ${({ colour }) => colour};
  display: flex;
  margin-left: 5px;
  gap: 0.5em;
  font-size: 24px;
`;

export const StyledValueWrapper = styled.div({
  marginTop: '5px',
});

export const StyledValueSpan = styled.span({
  display: 'block',
});
