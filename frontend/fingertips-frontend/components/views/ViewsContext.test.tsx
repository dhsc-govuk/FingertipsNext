import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ViewsContext } from './ViewsContext';
import { render } from '@testing-library/react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

jest.mock('next/navigation', () => {
  const originalModule = jest.requireActual('next/navigation');

  return {
    ...originalModule,
    useRouter: jest.fn().mockImplementation(() => ({})),
  };
});

const mockOneIndicatorOneAreaView = jest.fn();
jest.mock(
  './OneIndicatorOneAreaView/',
  () =>
    function fn() {
      mockOneIndicatorOneAreaView();
      return <div />;
    }
);

const mockOneIndicatorTwoOrMoreAreasView = jest.fn();
jest.mock(
  './OneIndicatorTwoOrMoreAreasView/',
  () =>
    function fn() {
      mockOneIndicatorTwoOrMoreAreasView();
      return <div />;
    }
);

const mockTwoOrMoreIndicatorsAreasView = jest.fn();
jest.mock(
  './TwoOrMoreIndicatorsAreasView/',
  () =>
    function fn() {
      mockTwoOrMoreIndicatorsAreasView();
      return <div />;
    }
);

const mockTwoOrMoreIndicatorsEnglandView = jest.fn();
jest.mock(
  './TwoOrMoreIndicatorsEnglandView/',
  () =>
    function fn() {
      mockTwoOrMoreIndicatorsEnglandView();
      return <div />;
    }
);

const mockAvailableAreas = [
  {
    code: 'A010',
    name: 'Area 10',
    areaType: { key: '', name: '', level: 1, hierarchyName: '' },
  },
  {
    code: 'A020',
    name: 'Area 20',
    areaType: { key: '', name: '', level: 1, hierarchyName: '' },
  },
];

describe('ViewsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    [['1'], ['A001'], mockOneIndicatorOneAreaView],
    [['1'], ['A001', 'A002'], mockOneIndicatorTwoOrMoreAreasView],
    [['1'], ['A001', 'A002', 'A003'], mockOneIndicatorTwoOrMoreAreasView],
    [['1', '2'], ['A001'], mockTwoOrMoreIndicatorsAreasView],
    [['1', '2', '3'], ['A001'], mockTwoOrMoreIndicatorsAreasView],
    [['1', '2', '3'], ['A001', 'A002'], mockTwoOrMoreIndicatorsAreasView],
    [['1', '2'], [areaCodeForEngland], mockTwoOrMoreIndicatorsEnglandView],
    [['1', '2', '3'], [areaCodeForEngland], mockTwoOrMoreIndicatorsEnglandView],
  ])(
    'should return the expected view',
    async (indicators, areaCodes, correctView) => {
      const searchState: SearchStateParams = {
        [SearchParams.AreasSelected]: areaCodes,
        [SearchParams.IndicatorsSelected]: indicators,
      };
      render(<ViewsContext searchState={searchState} />);

      expect(correctView).toHaveBeenCalled();
    }
  );

  it.each([
    [['1'], ['A001'], mockAvailableAreas, mockOneIndicatorTwoOrMoreAreasView],
    [
      ['1'],
      ['A001', 'A002'],
      [mockAvailableAreas[1]],
      mockOneIndicatorOneAreaView,
    ],
  ])(
    'should return the expected view when all areas in a group are selected',
    async (indicators, areaCodes, testAvailableAreas, correctView) => {
      const searchState: SearchStateParams = {
        [SearchParams.AreasSelected]: areaCodes,
        [SearchParams.IndicatorsSelected]: indicators,
        [SearchParams.GroupAreaSelected]: ALL_AREAS_SELECTED,
      };
      render(
        <ViewsContext
          searchState={searchState}
          areaFilterData={{
            availableAreas: testAvailableAreas,
          }}
        />
      );

      expect(correctView).toHaveBeenCalled();
    }
  );

  it('should default to england area code when no areas have been selected', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: ['1'],
    };
    render(<ViewsContext searchState={searchState} />);

    expect(mockOneIndicatorOneAreaView).toHaveBeenCalled();
  });

  it('should error if an invalid state is provided', () => {
    const searchState: SearchStateParams = {
      [SearchParams.IndicatorsSelected]: [],
      [SearchParams.AreasSelected]: undefined,
    };

    expect(() => render(<ViewsContext searchState={searchState} />)).toThrow();
  });
});
