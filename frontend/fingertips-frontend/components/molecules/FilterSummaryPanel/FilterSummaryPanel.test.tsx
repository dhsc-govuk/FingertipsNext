import { render, screen } from '@testing-library/react';
import {
  FilterSummaryPanel,
  FilterSummaryPanelProps,
} from '@/components/molecules/FilterSummaryPanel/index';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';
import { userEvent, UserEvent } from '@testing-library/user-event';
import { LoaderContext } from '@/context/LoaderContext';
import { SearchStateParams } from '@/lib/searchStateManager';

const mockPath = 'some-mock-path';
const mockReplace = vi.fn();

const mockLoaderContext: LoaderContext = {
  getIsLoading: vi.fn(),
  setIsLoading: vi.fn(),
};
vi.mock('@/context/LoaderContext', () => {
  return {
    useLoadingState: () => mockLoaderContext,
  };
});

const mockSearchState: SearchStateParams = {};
vi.mock('@/components/hooks/useSearchStateParams', () => ({
  useSearchStateParams: () => mockSearchState,
}));

vi.mock('next/navigation', async () => {
  const originalModule = await vi.importActual('next/navigation');

  return {
    ...originalModule,
    usePathname: () => mockPath,
    useSearchParams: () => {},
    useRouter: vi.fn().mockImplementation(() => ({
      replace: mockReplace,
    })),
  };
});

describe('FilterSummaryPanel', () => {
  let user: UserEvent;
  const mockChangeSelection = vi.fn();

  beforeEach(() => {
    user = userEvent.setup();
  });
  afterEach(() => {
    vi.clearAllMocks();
  });

  const defaultProps: FilterSummaryPanelProps = {
    selectedIndicatorsData: [generateIndicatorDocument('1')],
    changeSelection: mockChangeSelection,
  };

  function renderPanel(props: FilterSummaryPanelProps = defaultProps) {
    render(<FilterSummaryPanel {...props} />);
  }

  it('should render selected indicator when one indicator selected', () => {
    renderPanel();

    expect(screen.queryByTestId('pill-container')).toBeInTheDocument();
  });

  it('should not render selected indicators when more than one indicator selected', () => {
    renderPanel({
      ...defaultProps,
      selectedIndicatorsData: [
        generateIndicatorDocument('2'),
        generateIndicatorDocument('3'),
      ],
    });

    expect(screen.queryByTestId('pill-container')).not.toBeInTheDocument();
  });

  it('should render a show filters cta', () => {
    renderPanel();

    expect(screen.queryByTestId('show-filter-cta')).toBeInTheDocument();
  });

  it('should call changeSelection prop when show filter cta is clicked', async () => {
    renderPanel();
    await user.click(screen.getByTestId('show-filter-cta'));

    expect(mockChangeSelection).toBeCalled();
  });
});
