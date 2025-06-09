import { GovukColours } from '@/lib/styleHelpers/colours';
import styled from 'styled-components';
import { H5 } from 'govuk-react';

export const StyledHoverWrapper = styled.div({
  marginBlock: '10px',
  textWrap: 'wrap',
  width: '180px',
});

export const StyledTitleH5 = styled(H5)({
  marginBlock: '0px',
  fontSize: '12px',
});

export const StyledYearParagraph = styled.p({ marginBlock: '0px' });

export const StyledDataWrapper = styled.div({
  display: 'flex',
  alignItems: 'center',
  gap: '0.5em',
});

export const StyledSymbolDiv = styled('div')<{ color: GovukColours }>(
  ({ color }) => ({
    color: color,
    display: 'flex',
    marginLeft: '5px',
    gap: '0.5em',
    fontSize: '24px',
  })
);

export const StyledValueWrapper = styled.div({
  marginTop: '5px',
});

export const StyledValueSpan = styled.span({
  display: 'block',
});
