import { render } from '@testing-library/react';
import { HighlightText } from '.';

describe('HighlightText', () => {
  it('should highlight the searchHint part of the text provided', () => {
    const container = render(
      <HighlightText text="This is some text" searchHint="some" />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should highlight the searchHint part of the text provided regardless of case', () => {
    const container = render(
      <HighlightText text="This is some text" searchHint="this" />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should highlight the searchHint part of the text provided when there are parentheses', () => {
    const container = render(
      <HighlightText text="(This is) some text" searchHint="(This " />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
