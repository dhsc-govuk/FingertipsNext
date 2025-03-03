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
    [['zam'], ['foo'], mockOneIndicatorOneAreaView],
    [['zam'], ['foo', 'bar'], mockOneIndicatorTwoOrMoreAreasView],
    [['foo', 'bar'], ['foo'], mockTwoOrMoreIndicatorsAreasView],
    [['foo', 'bar'], [areaCodeForEngland], mockTwoOrMoreIndicatorsEnglandView],
    [
      ['foo', 'bar', 'baz'],
      [areaCodeForEngland],
      mockTwoOrMoreIndicatorsEnglandView,
    ],
    [
      ['foo', 'bar', 'baz'],
      [areaCodeForEngland],
      mockTwoOrMoreIndicatorsEnglandView,
    ],
    [['foo', 'bar', 'baz'], ['foo'], mockTwoOrMoreIndicatorsAreasView],
    [['foo', 'bar'], [areaCodeForEngland], mockTwoOrMoreIndicatorsEnglandView],
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
