import { render, screen } from '@testing-library/react';
import { ChartPageWrapper } from '.';
import { SearchStateParams, SearchParams } from '@/lib/searchStateManager';
import { userEvent, UserEvent } from '@testing-library/user-event';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const ChildComponent = () => (
  <div data-testid="some-child-component">Child component</div>
);

const mockSearch = 'test';
const mockIndicator = ['108'];
const mockAreas = ['E12000001', 'E12000003'];

const searchState: SearchStateParams = {
  [SearchParams.SearchedIndicator]: mockSearch,
  [SearchParams.IndicatorsSelected]: mockIndicator,
  [SearchParams.AreasSelected]: mockAreas,
};

describe('ChartPageWrapper', () => {
  let user: UserEvent;

  const renderWrapper = () => {
    return render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );
  };

  beforeEach(() => {
    user = userEvent.setup();
  });

  it('should render the back link path back to the results page', () => {
    renderWrapper();

    const backLink = screen.getByRole('link', { name: /back/i });
    const expectedUrl = `/results?${SearchParams.SearchedIndicator}=${mockSearch}&${SearchParams.IndicatorsSelected}=${mockIndicator}&${SearchParams.AreasSelected}=${mockAreas[0]}&${SearchParams.AreasSelected}=${mockAreas[1]}`;

    expect(backLink).toBeInTheDocument();
    expect(backLink).toHaveAttribute('data-testid', 'chart-page-back-link');
    expect(backLink).toHaveAttribute('href', expectedUrl);
  });

  it('should render the area filter pane', () => {
    renderWrapper();

    expect(screen.getByTestId('area-filter-container')).toBeInTheDocument();
  });

  it('should render the child component', () => {
    renderWrapper();

    expect(screen.getByTestId('some-child-component')).toBeInTheDocument();
  });

  it('area filters and filter summary can be toggled using the hide-filters and change-selection buttons', async () => {
    renderWrapper();
    expect(
      screen.getByTestId('area-filter-pane-hidefilters')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('filter-summary-panel')
    ).not.toBeInTheDocument();

    await user.click(screen.getByTestId('area-filter-pane-hidefilters'));

    expect(
      screen.queryByTestId('area-filter-pane-hidefilters')
    ).not.toBeInTheDocument();
    expect(screen.getByTestId('filter-summary-panel')).toBeInTheDocument();

    await user.click(
      screen.getByTestId('filter-summary-panel-change-selection')
    );

    expect(
      screen.getByTestId('area-filter-pane-hidefilters')
    ).toBeInTheDocument();
    expect(
      screen.queryByTestId('filter-summary-panel')
    ).not.toBeInTheDocument();
  });
});
