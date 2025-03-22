import { render, screen } from '@testing-library/react';
import { IndicatorSelectedPill } from './index';
import { SearchParams } from '@/lib/searchStateManager';
import { generateIndicatorDocument } from '@/lib/search/mockDataHelper';

const mockIndicator = generateIndicatorDocument('1');

describe('IndicatorSelectedPill', () => {
  it('should render the IndicatorSelectedPill correctly', () => {
    render(<IndicatorSelectedPill indicator={mockIndicator} />);
    expect(screen.getByText(mockIndicator.indicatorName)).toBeInTheDocument();
    expect(screen.getByRole('link')).toBeInTheDocument();
  });

  it('should have the correct href with searchState as query param to the indicator meta data page', async () => {
    const expectedPath = [
      `/indicator/${mockIndicator.indicatorID}`,
      `?${SearchParams.IndicatorsSelected}=${mockIndicator.indicatorID}`,
      `&${SearchParams.AreasSelected}=A001&${SearchParams.AreasSelected}=A002`,
    ].join('');

    render(
      <IndicatorSelectedPill
        indicator={mockIndicator}
        searchState={{
          [SearchParams.IndicatorsSelected]: [mockIndicator.indicatorID],
          [SearchParams.AreasSelected]: ['A001', 'A002'],
        }}
      />
    );

    expect(screen.getByRole('link')).toHaveAttribute('href', expectedPath);
  });

  it('should match snapshot', () => {
    const { asFragment } = render(
      <IndicatorSelectedPill indicator={mockIndicator} />
    );
    expect(asFragment()).toMatchSnapshot();
  });
});
