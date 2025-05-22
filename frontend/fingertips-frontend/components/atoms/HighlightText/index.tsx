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
  return text
    .split('')
    .reduce((accumulator: React.JSX.Element[], char: string, index: number) => {
      if (
        highlightStartPos <= index &&
        index < highlightStartPos + textToBeHighlighted.length
      ) {
        accumulator.push(
          <StyleHighLightedText key={char + index}>{char}</StyleHighLightedText>
        );
      } else {
        accumulator.push(<span key={char + index}>{char}</span>);
      }
      return accumulator;
    }, []);
};

export const HighlightText = ({
  text,
  searchHint,
}: Readonly<{ text: string; searchHint: string }>) => {
  const highlightedChars = highlightChars(text, searchHint);
  return <>{highlightedChars}</>;
};
