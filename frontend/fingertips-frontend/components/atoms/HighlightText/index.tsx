import { highlightTag } from '@/lib/search/searchTypes';
import styled from 'styled-components';

const StyleHighLightedText = styled('span')({
  fontWeight: '600',
});

const highlightChars = (text: string, searchHint: string) => {
  const highlightStart = searchHint.indexOf(highlightTag);
  const hightlightEnd = searchHint.lastIndexOf(highlightTag);

  const textToBeHighlighted = searchHint.slice(
    highlightStart + highlightTag.length,
    hightlightEnd
  );

  const highlightStartPos = text
    .toLowerCase()
    .indexOf(textToBeHighlighted.toLowerCase());
  const hightlightEndPos = highlightStartPos + textToBeHighlighted.length;
  return [
    text.slice(0, highlightStartPos),
    <StyleHighLightedText key="searchMatch">
      {textToBeHighlighted}
    </StyleHighLightedText>,
    text.slice(hightlightEndPos),
  ];
};

export const HighlightText = ({
  text,
  searchHint,
}: Readonly<{ text: string; searchHint: string }>) => {
  const highlightedChars = highlightChars(text, searchHint);
  return <>{highlightedChars}</>;
};
