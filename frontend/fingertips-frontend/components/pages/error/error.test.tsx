import { render } from '@testing-library/react';
import { expect } from '@jest/globals';
import { ErrorPage } from '.';

describe('Error Page', () => {
  it('snapshot test', () => {
    const container = render(
      <ErrorPage />
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
