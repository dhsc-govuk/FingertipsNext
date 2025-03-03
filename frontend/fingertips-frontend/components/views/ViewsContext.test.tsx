import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ViewsContext } from './ViewsContext';
import { render } from '@testing-library/react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

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
});
