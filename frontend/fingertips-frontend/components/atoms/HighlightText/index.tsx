import styled from 'styled-components';

const StyleHighLightedText = styled('span')({
  fontWeight: '600',
});

export const HighlightText = ({
  text,
  searchHint,
}: Readonly<{ text: string; searchHint: string }>) => {
  const firstIndexOf = text.indexOf(searchHint);
  const lastIndexOf = firstIndexOf + searchHint.length;

  const firstStandardPart = text.slice(0, firstIndexOf);
  const highlightPart = text.slice(firstIndexOf, lastIndexOf);
  const secondStandardPart = text.slice(lastIndexOf, text.length);
  return (
    <>
      {firstStandardPart}
      <StyleHighLightedText>{highlightPart}</StyleHighLightedText>
      {secondStandardPart}
    </>
  );
};
