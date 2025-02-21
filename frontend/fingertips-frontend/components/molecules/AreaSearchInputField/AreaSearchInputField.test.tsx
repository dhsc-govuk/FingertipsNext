import { render } from '@testing-library/react';
import { AreaSearchInputField } from './index';

describe('AreaSearchInputField', () => {
  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaSearchInputField value="London" onTextChange={jest.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display hint text correctly', () => {
    const { getByText } = render(
      <AreaSearchInputField value="London" onTextChange={jest.fn()} />
    );
    expect(
      getByText(
        'For example district, county, region, NHS organisation or GP practice or code'
      )
    ).toBeInTheDocument();
  });

  it('should display error message if touched', () => {
    const { getByText } = render(
      <AreaSearchInputField
        value="London"
        touched={true}
        onTextChange={jest.fn()}
      />
    );
    expect(getByText('This field value may be required')).toBeInTheDocument();
  });

  it('should not display error message if not touched', () => {
    const { queryByText } = render(
      <AreaSearchInputField
        value="London"
        touched={false}
        onTextChange={jest.fn()}
      />
    );
    expect(queryByText('This field value may be required')).toBeNull();
  });

  it('should not disable the input if disabled prop is not passed', () => {
    const { getByTestId } = render(
      <AreaSearchInputField
        value="London"
        disabled={false}
        onTextChange={jest.fn()}
      />
    );
    const input = getByTestId('search-form-input-area');
    expect(input).not.toBeDisabled();
  });
});
