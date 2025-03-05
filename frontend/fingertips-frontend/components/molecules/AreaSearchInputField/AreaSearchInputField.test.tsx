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

  it('should display error message if hasError is true', () => {
    const { getByText } = render(
      <AreaSearchInputField
        value="London"
        hasError={true}
        onTextChange={jest.fn()}
      />
    );

    expect(getByText('This field value may be required')).toBeInTheDocument();
  });

  it('should not display error message if hasError is false', () => {
    const { queryByText } = render(
      <AreaSearchInputField
        value="London"
        hasError={false}
        onTextChange={jest.fn()}
      />
    );

    expect(
      queryByText('This field value may be required')
    ).not.toBeInTheDocument();
  });

  it('should be enabled if disabled prop is false', () => {
    const { getByRole } = render(
      <AreaSearchInputField
        value="London"
        disabled={false}
        onTextChange={jest.fn()}
      />
    );

    const input = getByRole('textbox');

    expect(input).toBeEnabled();
  });

  it('should be disabled if disabled prop is true', () => {
    const { getByRole } = render(
      <AreaSearchInputField
        value="London"
        disabled={true}
        onTextChange={jest.fn()}
      />
    );

    const input = getByRole('textbox');

    expect(input).toBeDisabled();
  });
});
