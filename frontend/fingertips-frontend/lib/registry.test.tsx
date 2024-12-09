import { expect } from '@jest/globals';
import { render, screen } from '@testing-library/react';
import StyledComponentsRegistry from './registry';

const SomeComponent = () => {
  return <>Hello World</>;
};

describe('StyledComponentsRegistry', () => {
  it('should include the stylesheets when on the server side', () => {
    const container = render(
      <StyledComponentsRegistry>
        <SomeComponent />
      </StyledComponentsRegistry>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
