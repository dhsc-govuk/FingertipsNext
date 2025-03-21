import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ViewsContext } from './ViewsContext';
import { render } from '@testing-library/react';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

jest.mock('../pages/chartPageWrapper', () => ({
  ChartPageWrapper: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="chart-page-wrapper">{children}</div>
  ),
}));

jest.mock('./ViewsSelector', () => ({
  ViewsSelector: ({
    areaCodes,
    indicators,
  }: {
    areaCodes: string[];
    indicators: string[];
  }) => (
    <div data-testid="views-selector">
      <div data-testid="area-codes">{JSON.stringify(areaCodes)}</div>
      <div data-testid="indicators">{JSON.stringify(indicators)}</div>
    </div>
  ),
}));

describe('ViewsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('take a snap shot', () => {
    const searchState: SearchStateParams = {
      [SearchParams.AreasSelected]: ['area1', 'area2'],
      [SearchParams.IndicatorsSelected]: ['1', '2', '3'],
    };
    const container = render(<ViewsContext searchState={searchState} />);
    expect(container.asFragment()).toMatchSnapshot();
  });
});
