import styled from 'styled-components';

const StyleHighLightedText = styled('span')({
  fontWeight: '600',
});

const highlightChar = (
  accumulated: React.JSX.Element[],
  textArray: string[],
  searchHintArray: string[]
) => {
  if (textArray.length === 0) {
    return accumulated;
  }

  if (
    searchHintArray.length > 0 &&
    textArray?.[0].toLowerCase() === searchHintArray[0].toLowerCase()
  ) {
    accumulated.push(
      <StyleHighLightedText key={accumulated.length}>
        {textArray[0]}
      </StyleHighLightedText>
    );
    return highlightChar(
      accumulated,
      textArray.slice(1, textArray.length),
      searchHintArray.slice(1, searchHintArray.length)
    );
  }

  accumulated.push(<span key={accumulated.length}>{textArray[0]}</span>);
  return highlightChar(
    accumulated,
    textArray.slice(1, textArray.length),
    searchHintArray.slice(0, searchHintArray.length)
  );
};

export const HighlightText = ({
  text,
  searchHint,
}: Readonly<{ text: string; searchHint: string }>) => {
  const highlightedChars = highlightChar(
    [],
    text.split(''),
    searchHint.trim().split('')
  );

  return <>{highlightedChars}</>;
};
