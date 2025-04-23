import React from 'react';
import { render } from '@testing-library/react';
import { SearchParams, SearchStateParams } from '@/lib/searchStateManager';
import { ViewsSelector } from './ViewsSelector';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { ALL_AREAS_SELECTED } from '@/lib/areaFilterHelpers/constants';

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

describe('ViewsSelector', () => {
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

  const searchState: SearchStateParams = {
    [SearchParams.IndicatorsSelected]: ['1'],
    [SearchParams.AreasSelected]: undefined,
  };

  it('should error if an invalid state is provided', () => {
    expect(() =>
      render(
        <ViewsSelector
          areaCodes={[]}
          indicators={['1', '2']}
          searchState={searchState}
        />
      )
    ).toThrow();
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
      render(
        <ViewsSelector
          areaCodes={areaCodes}
          indicators={indicators}
          searchState={searchState}
        />
      );

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
        <ViewsSelector
          areaCodes={areaCodes}
          indicators={indicators}
          searchState={searchState}
        />
      );

      expect(correctView).toHaveBeenCalled();
    }
  );
});
