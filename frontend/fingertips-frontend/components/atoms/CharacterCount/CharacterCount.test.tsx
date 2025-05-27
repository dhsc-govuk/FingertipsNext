import { render } from '@testing-library/react';
import { CharacterCount } from '.';

const underLimitText = (characterLimit: number, textLength: number) =>
  `You have ${characterLimit - textLength} characters remaining.`;

describe('CharacterCount', () => {
  it('should not render any text if no character limit given', () => {
    const fragment = render(<CharacterCount textLength={0} />);

    expect(fragment.baseElement).toHaveTextContent('');
  });

  it('should not render any text if character limit is below 1', () => {
    const fragment = render(
      <CharacterCount textLength={0} characterLimit={0} />
    );

    expect(fragment.baseElement).toHaveTextContent('');
  });

  it('should render expected text if character limit above 1', () => {
    const characterLimit = 10;
    const textLength = 6;
    const fragment = render(
      <CharacterCount textLength={textLength} characterLimit={characterLimit} />
    );

    expect(fragment.baseElement).toHaveTextContent(
      underLimitText(characterLimit, textLength)
    );
  });

  it('should not render any text if threshold % is given and above 100', () => {
    const fragment = render(
      <CharacterCount
        textLength={6}
        characterLimit={10}
        thresholdPercentage={101}
      />
    );

    expect(fragment.baseElement).toHaveTextContent('');
  });

  it('should render expected text if text length is above threshold %', () => {
    const characterLimit = 10;
    const textLength = 6;
    const fragment = render(
      <CharacterCount
        textLength={textLength}
        characterLimit={characterLimit}
        thresholdPercentage={50}
      />
    );

    expect(fragment.baseElement).toHaveTextContent(
      underLimitText(characterLimit, textLength)
    );
  });

  it('should not render any text if text length is below threshold %', () => {
    const fragment = render(
      <CharacterCount
        textLength={6}
        characterLimit={10}
        thresholdPercentage={75}
      />
    );

    expect(fragment.baseElement).toHaveTextContent('');
  });

  it('should render different text if text length above character limit', () => {
    const characterLimit = 10;
    const textLength = 11;
    const fragment = render(
      <CharacterCount textLength={textLength} characterLimit={characterLimit} />
    );

    expect(fragment.baseElement).toHaveTextContent(
      `You have ${textLength - characterLimit} characters too many`
    );
  });
});
