import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { mockHealthData } from '@/mock/data/healthdata';
import { ViewsContext } from '@/app/views';
import { render } from '@testing-library/react';
import { Chart } from '@/components/pages/chart';

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

jest.mock('@/app/views/');
const mockViewsContext = jest.mocked(ViewsContext);

describe('ChartWithViews', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
  it('should pass search state prop with data from the params to ViewsContext', async () => {
    const mockAreaCode = 'E06000047';
    const searchParams: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['333'],
      [SearchParams.AreasSelected]: [mockAreaCode],
    };

    render(
      <Chart
        healthIndicatorData={[mockHealthData['337']]}
        searchState={await generateSearchParams(searchParams)}
      />
    );

    expect(mockViewsContext).toHaveBeenCalled;

    // expect(page.props.searchState).toEqual({
    //   [SearchParams.SearchedIndicator]: 'testing',
    //   [SearchParams.IndicatorsSelected]: ['333'],
    //   [SearchParams.AreasSelected]: ['E06000047'],
    // });
  });
});
