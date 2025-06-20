import { render, screen, waitFor, within } from '@testing-library/react';
import { Home } from '@/components/pages/home/index';
import { SearchFormState } from '@/components/forms/SearchForm/searchActions';
import { expect } from '@jest/globals';
import { userEvent } from '@testing-library/user-event';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateParams } from '@/lib/searchStateManager';

const initialState: SearchFormState = {
  indicator: '',
  searchState: '',
  message: null,
  errors: {},
};

jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    set: jest.fn(),
  }),
  useSearchParams: jest.fn(),
  usePathname: jest.fn(),
}));

const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: jest.fn(),
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchState: SearchStateParams = {};
jest.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

const setupUI = (state?: SearchFormState) => {
  if (!state) {
    state = initialState;
  }
  return render(<Home initialFormState={state} />);
};

afterEach(() => {
  jest.clearAllMocks();
});

it('should render an indicator link', () => {
  setupUI();
  const link = screen.getByRole('link', { name: /indicators/ });

  expect(link).toBeInTheDocument();
});

it('should render an indicator link that points to the indicator section', () => {
  setupUI();
  const link = screen.getByRole('link', { name: /indicators/ });

  expect(link).toHaveAttribute('href', '#indicators');
});

it('should render the SearchForm component', () => {
  setupUI();
  const searchForm = screen.getByTestId('search-form');

  expect(searchForm).toBeInTheDocument();
});

it('should display the error summary component when there is a validation error', () => {
  const errorState: SearchFormState = {
    indicator: '',
    searchState: '',
    message: 'Error message',
    errors: {},
  };
  setupUI(errorState);

  expect(screen.getByTestId('search-form-error-summary')).toBeInTheDocument();
});

it('should focus on the input boxes when there is a validation error', async () => {
  // Add missing function to jsdom
  const scrollMock = jest.fn();
  window.HTMLElement.prototype.scrollIntoView = scrollMock;

  const user = userEvent.setup();

  const errorState: SearchFormState = {
    indicator: '',
    searchState: '',
    message: 'Error message',
    errors: {},
  };

  setupUI(errorState);

  const anchor = within(screen.getByTestId('search-form-error-summary'))
    .getByText('Enter a subject you want to search for')
    .closest('a')!;
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
      linkText: 'What the service is for',
      headingText: 'What the service is for',
    },
    { linkText: 'About indicators', headingText: 'About indicators' },
    {
      linkText: 'Who the service is for',
      headingText: 'Who the service is for',
    },
  ])('$linkText', ({ linkText, headingText }) => {
    setupUI();

    const href = screen
      .getByRole('link', { name: linkText })
      .getAttribute('href')!;

    expect(
      screen.getByRole('heading', { name: headingText }).closest(`${href}`)
    ).toHaveAttribute('id', href.slice(1));
  });

  it('content item find public health data should link to the search section', () => {
    setupUI();

    const link = screen.getByRole('link', { name: 'Find public health data' });
    expect(link).toHaveAttribute('href', '#search');

    const section = document.getElementById('search');
    expect(section).toBeInTheDocument();

    const heading = within(section!).getByRole('heading', {
      name: 'Find public health data',
    });
    expect(heading).toBeInTheDocument();
  });
});
