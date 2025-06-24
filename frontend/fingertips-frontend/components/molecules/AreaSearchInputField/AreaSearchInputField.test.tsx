import { render } from '@testing-library/react';
import { AreaSearchInputField } from './index';

const areaSearchErrorMessage = 'Enter an area you want to search for';

describe('AreaSearchInputField', () => {
  it('should render correctly and match snapshot', () => {
    const { asFragment } = render(
      <AreaSearchInputField value="London" onTextChange={vi.fn()} />
    );
    expect(asFragment()).toMatchSnapshot();
  });

  it('should display hint text correctly', () => {
    const { getByText } = render(
      <AreaSearchInputField value="London" onTextChange={vi.fn()} />
    );

    expect(
      getByText(
        'For example, postcode, district, county, region, NHS organisation or GP practice or code'
      )
    ).toBeInTheDocument();
  });

  it('should display error message if hasError is true', () => {
    const { getByText } = render(
      <AreaSearchInputField
        value="London"
        hasError={true}
        onTextChange={vi.fn()}
      />
    );

    expect(getByText(areaSearchErrorMessage)).toBeInTheDocument();
  });

  it('should not display error message if hasError is false', () => {
    const { queryByText } = render(
      <AreaSearchInputField
        value="London"
        hasError={false}
        onTextChange={vi.fn()}
      />
    );

    expect(queryByText(areaSearchErrorMessage)).toBeNull();
  });

  it('should be enabled if disabled prop is false', () => {
    const { getByRole } = render(
      <AreaSearchInputField
        value="London"
        disabled={false}
        onTextChange={vi.fn()}
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
        onTextChange={vi.fn()}
      />
    );

    const input = getByRole('textbox');

    expect(input).toBeDisabled();
  });
});
