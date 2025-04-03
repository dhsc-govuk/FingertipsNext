import { render, screen } from '@testing-library/react';
import { mockHealthData } from '@/mock/data/healthdata';
import { ThematicMap } from '.';
import { getMapGeographyData } from '@/components/organisms/ThematicMap/thematicMapHelpers';
import { SearchStateContext } from '@/context/SearchStateContext';
import { SearchParams } from '@/lib/searchStateManager';

const mockAreaType = 'regions';
const mockAreaCodes = ['E12000001', 'E12000002'];
const mockMapGeographyData = getMapGeographyData(mockAreaType, mockAreaCodes);

const mockGetSearchState = jest.fn();
const mockSearchStateContext: SearchStateContext = {
  getSearchState: mockGetSearchState,
  setSearchState: jest.fn(),
};
jest.mock('@/context/SearchStateContext', () => {
  return {
    useSearchState: () => mockSearchStateContext,
  };
});

describe('ThematicMap', () => {
  beforeEach(() => {
    mockGetSearchState.mockReturnValue({
      [SearchParams.AreaTypeSelected]: 'regions',
    });
  });

  it('should render the benchmark legend', async () => {
    render(
      <ThematicMap
        healthIndicatorData={mockHealthData['92420']}
        mapGeographyData={mockMapGeographyData}
        benchmarkComparisonMethod={'Unknown'}
        polarity={'Unknown'}
        measurementUnit={''}
      />
    );

    const actual = await screen.findByTestId('benchmarkLegend-component');
    expect(actual).toBeInTheDocument();
  });
});
