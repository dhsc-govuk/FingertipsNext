import { render, screen } from '@testing-library/react';
import { ChartPageWrapper } from '.';
import { SearchStateParams, SearchParams } from '@/lib/searchStateManager';

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
  const renderWrapper = () => {
    return render(
      <ChartPageWrapper searchState={searchState}>
        <ChildComponent />
      </ChartPageWrapper>
    );
  };

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
});
