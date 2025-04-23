import { render } from '@testing-library/react';
import { StyledFilterSelect } from './StyledFilterSelect';

describe('StyledFilterSelect', () => {
  it('should style the Select component as expected', () => {
    const container = render(
      <StyledFilterSelect label="Select an area">
        <option value="some value">some option</option>
      </StyledFilterSelect>
    );

    expect(container.asFragment()).toMatchSnapshot();
  });
});
