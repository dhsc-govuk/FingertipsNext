import { render } from '@testing-library/react';
import { HighlightText } from '.';
import { highlightTag } from '@/lib/search/searchTypes';

describe('HighlightText', () => {
  it('should highlight the searchHint part of the text provided', () => {
    const container = render(
      <HighlightText
        text="This is some text"
        searchHint={`${highlightTag}some${highlightTag}`}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should highlight the searchHint part of the text provided regardless of case', () => {
    const container = render(
      <HighlightText
        text="This is some text"
        searchHint={`${highlightTag}this${highlightTag}`}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should highlight the searchHint part of the text provided when there are parentheses', () => {
    const container = render(
      <HighlightText
        text="(This is) some text"
        searchHint={`${highlightTag}(This ${highlightTag}`}
      />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
