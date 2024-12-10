import { expect } from '@jest/globals';
import { render } from '@testing-library/react';
import StyledComponentsRegistry from './registry';
import { isBrowser } from './utils';
import styled from 'styled-components';

jest.mock('./utils');

const mockIsBrowser = isBrowser as jest.MockedFunction<typeof isBrowser>;

const StyledDiv = styled('div')<{ bgColor: string }>(({ bgColor, color }) => ({
  backgroundColor: bgColor,
  color,
}));

const SomeComponent = () => {
  return (
    <StyledDiv bgColor="blue" color="red">
      Hello World
    </StyledDiv>
  );
};

describe('StyledComponentsRegistry', () => {
  it('should return inline styles when rendering the wrapped component client side', () => {
    mockIsBrowser.mockReturnValue(true);

    const container = render(
      <StyledComponentsRegistry>
        <SomeComponent />
      </StyledComponentsRegistry>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });

  it('should not return inline styles when rendering the wrapped component server side', () => {
    mockIsBrowser.mockReturnValue(false);

    const container = render(
      <StyledComponentsRegistry>
        <SomeComponent />
      </StyledComponentsRegistry>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
