import styled from 'styled-components';

export const LegendContainerWithMargin = styled.div({
  marginBottom: '2em',
});
export const LegendContainerNoMargin = styled.div({});

export const BenchmarkLegendHeader = styled('h4')({
  alignSelf: 'stretch',
  margin: '16px 0 8px 0',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
  fontSize: '19px',
});

export const LegendGroup = styled('div')({
  position: 'relative',
  left: '-5px',
});

export const StyledLegendLabel = styled('span')({
  display: 'block',
  margin: '4px 0 0 0',
  fontFamily: 'nta,Arial,sans-serif',
  fontWeight: 300,
  fontSize: '16px', //16px
});
