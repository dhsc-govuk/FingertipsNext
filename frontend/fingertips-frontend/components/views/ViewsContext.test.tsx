/* eslint-disable react/display-name */
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ViewsContext } from './ViewsContext';
import { render } from '@testing-library/react';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const mockOneIndicatorOneAreaView = jest.fn();
jest.mock('./OneIndicatorOneAreaView/', () => () => {
  mockOneIndicatorOneAreaView();
  return <div />;
});

const mockOneIndicatorTwoOrMoreAreasView = jest.fn();
jest.mock('./OneIndicatorTwoOrMoreAreasView/', () => () => {
  mockOneIndicatorTwoOrMoreAreasView();
  return <div />;
});

const mockTwoOrMoreIndicatorsAreasView = jest.fn();
jest.mock('./TwoOrMoreIndicatorsAreasView/', () => () => {
  mockTwoOrMoreIndicatorsAreasView();
  return <div />;
});

const mockTwoOrMoreIndicatorsEnglandView = jest.fn();
jest.mock('./TwoOrMoreIndicatorsEnglandView/', () => () => {
  mockTwoOrMoreIndicatorsEnglandView();
  return <div />;
});

async function generateSearchParams(value: SearchStateParams) {
  return value;
}

describe('ViewsContext', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  it.each([
    [['foo'], ['zam'], mockOneIndicatorOneAreaView],
    [['foo', 'bar'], ['zam'], mockOneIndicatorTwoOrMoreAreasView],
    [['foo'], ['foo', 'bar', 'baz'], mockTwoOrMoreIndicatorsAreasView],
    [[areaCodeForEngland], ['foo', 'bar'], mockTwoOrMoreIndicatorsEnglandView],
  ])(
    'should return the expected view',
    async (areaCodes, indicators, correctView) => {
      const searchParams: SearchStateParams = {
        [SearchParams.AreasSelected]: areaCodes,
        [SearchParams.IndicatorsSelected]: indicators,
      };
      const searchState = await generateSearchParams(searchParams);
      render(<ViewsContext searchState={searchState} />);

      expect(correctView).toHaveBeenCalled();
    }
  );
});
