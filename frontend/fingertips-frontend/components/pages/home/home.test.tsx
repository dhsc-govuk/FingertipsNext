import { render, screen, waitFor } from '@testing-library/react';
import { Home } from '@/components/pages/home/index';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { expect } from '@jest/globals';
import { userEvent } from '@testing-library/user-event';

const initialState: SearchFormState = {
  indicator: '',
  areaSearched: '',
  message: null,
  errors: {},
};

it('snapshot test - renders the homepage', () => {
  const container = render(<Home searchFormState={initialState} />);

  expect(container.asFragment()).toMatchSnapshot();
});

it('should render an indicator link', () => {
  render(<Home searchFormState={initialState} />);
  const link = screen.getByRole('link', { name: /indicators/ });

  expect(link).toBeInTheDocument();
});

it('should render an indicator link that points to the indicator section', () => {
  render(<Home searchFormState={initialState} />);
  const link = screen.getByRole('link', { name: /indicators/ });

  expect(link).toHaveAttribute('href', '#indicators');
});

it('should render the SearchForm component', () => {
  render(<Home searchFormState={initialState} />);
  const searchForm = screen.getByTestId('search-form');

  expect(searchForm).toBeInTheDocument();
});

it('should display the error summary component when there is a validation error', () => {
  const errorState: SearchFormState = {
    indicator: '',
    areaSearched: '',
    message: 'Error message',
    errors: {},
  };

  render(<Home searchFormState={errorState} />);

  expect(screen.getByTestId('search-form-error-summary')).toBeInTheDocument();
});

it('should focus on the input boxes when there is a validation error', async () => {
  // Add missing function to jsdom
  const scrollMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollMock;

  const user = userEvent.setup();

  const errorState: SearchFormState = {
    indicator: '',
    areaSearched: '',
    message: 'Error message',
    errors: {},
  };

  render(<Home searchFormState={errorState} />);

  const anchor = screen.getByText('Search subject').closest('a')!;
  await user.click(anchor);

  await waitFor(() => {
    expect(
      screen.getByRole('textbox', { name: /Search by subject/i })
    ).toHaveFocus();
  });
  expect(scrollMock).toBeCalledTimes(1);
});

describe('contents items should link to appropriate headings', () => {
  interface TestData {
    linkText: string;
    headingText: string;
  }
  it.each<TestData>([
    {
      linkText: 'Find public health data',
      headingText: 'Find public health data',
    },
    {
      linkText: 'What the service is for',
      headingText: 'What the service is for',
    },
    { linkText: 'About indicators', headingText: 'About indicators' },
    {
      linkText: 'Who the service is for',
      headingText: 'Who the service is for',
    },
  ])('$linkText', ({ linkText, headingText }) => {
    render(<Home searchFormState={initialState} />);

    const href = screen
      .getByRole('link', { name: linkText })
      .getAttribute('href')!;

    expect(
      screen.getByRole('heading', { name: headingText }).closest(`${href}`)
    ).toHaveAttribute('id', href.slice(1));
  });
});
