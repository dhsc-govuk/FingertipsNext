import { render, screen } from '@testing-library/react';
import { IndicatorDefinition, IndicatorDefinitionProps } from '.';
import placeholderIndicatorMetadata from '../../../assets/placeholderIndicatorMetadata.json';
import { formatDate } from '@/lib/dateHelpers/dateHelpers';
import { SearchParams } from '@/lib/searchStateManager';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateContext } from '@/context/SearchStateContext';
import userEvent from '@testing-library/user-event';

const indicatorDefinition: IndicatorDefinitionProps = {
  ...placeholderIndicatorMetadata,
  indicatorID: String(placeholderIndicatorMetadata.indicatorID),
  lastUpdatedDate: new Date(placeholderIndicatorMetadata.lastUpdatedDate),
};

const searchState = {
  [SearchParams.IndicatorsSelected]: ['1', '2'],
  [SearchParams.AreasSelected]: ['A001'],
};

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    usePathname: jest.fn(),
  };
});

const mockSetIsLoading = jest.fn();
const mockLoaderContext: LoaderContext = {
  getIsLoading: jest.fn(),
  setIsLoading: mockSetIsLoading,
};
jest.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchStateContext: SearchStateContext = {
  getSearchState: jest.fn(),
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('contents items should link to appropriate headings', () => {
  beforeEach(() => {
    render(
      <IndicatorDefinition
        indicatorDefinitionProps={indicatorDefinition}
        searchState={searchState}
      />
    );
  });

  interface TestData {
    linkText: string;
    titleText: string;
  }

  it.each<TestData>([
    {
      linkText: 'Indicator definitions',
      titleText: 'Indicator definitions',
    },
    {
      linkText: 'Data sources and reuse',
      titleText: 'Data sources and reuse',
    },
    {
      linkText: 'Benchmarking and confidence information',
      titleText: 'Benchmarking and confidence information',
    },
    {
      linkText: 'Indicator rationale',
      titleText: 'Indicator rationale',
    },
    {
      linkText: 'Notes and caveats',
      titleText: 'Notes and caveats',
    },
    {
      linkText: 'Profiles and links',
      titleText: 'Public health profile usage and related content',
    },
  ])('$linkText', ({ linkText, titleText }) => {
    const href = screen
      .getByRole('link', { name: linkText })
      .getAttribute('href')!;

    expect(
      screen.getByRole('heading', { name: titleText }).closest(`${href}`)
    ).toHaveAttribute('id', href.slice(1));
  });
});

describe('indicator description page', () => {
  beforeEach(() => {
    render(
      <IndicatorDefinition
        indicatorDefinitionProps={indicatorDefinition}
        searchState={searchState}
      />
    );
  });

  it('should match snapshot', () => {
    const page = render(
      <IndicatorDefinition
        indicatorDefinitionProps={indicatorDefinition}
        searchState={searchState}
      />
    );

    expect(page.asFragment()).toMatchSnapshot();
  });

  it('should the back link path to the chart page with the searchState paths', () => {
    const expectedPath = [
      `/chart`,
      `?${SearchParams.IndicatorsSelected}=1&${SearchParams.IndicatorsSelected}=2`,
      `&${SearchParams.AreasSelected}=A001`,
    ].join('');

    const backLink = screen.getByRole('link', { name: /back/i });

    expect(backLink).toBeInTheDocument();

    expect(backLink.getAttribute('href')).toBe(expectedPath);
  });

  it('should call setIsLoading when the back link is clicked', async () => {
    const user = userEvent.setup();
    await user.click(screen.getByRole('link', { name: /back/i }));

    expect(mockSetIsLoading).toHaveBeenCalledWith(true);
  });

  it('should lead with a title containing the indicator name', () => {
    expect(screen.getAllByRole('heading')[0]).toHaveTextContent(
      indicatorDefinition.indicatorName
    );
  });

  it('should contain the indicator ID', () => {
    expect(
      screen.getByText(indicatorDefinition.indicatorID, { exact: false })
    ).toBeInTheDocument();
  });

  it('should contain the indicator definition', () => {
    expect(
      screen.getByText(indicatorDefinition.indicatorDefinition, {
        exact: false,
      })
    ).toBeInTheDocument();
  });

  it('should contain the data source', () => {
    expect(
      screen.getByText(indicatorDefinition.dataSource, { exact: false })
    ).toBeInTheDocument();
  });

  it('should contain the last updated date', () => {
    expect(
      screen.getByText(formatDate(indicatorDefinition.lastUpdatedDate), {
        exact: false,
      })
    ).toBeInTheDocument();
  });
});
