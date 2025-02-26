import { describe } from 'node:test';
import {
  chartOptions,
  chartViews,
  getChartListForView,
  viewSelector,
} from './viewUtils';
import { areaCodeForEngland } from '../chartHelpers/constants';

describe('viewsSelector', () => {
  it.each([
    [['foo'], 'oneAreaView'],
    [['foo', 'bar'], 'twoAreasView'],
    [['foo', 'bar', 'baz'], 'threeOrMoreAreasView'],
    [['foo', 'bar', 'baz', 'bert'], 'threeOrMoreAreasView'],
    [[areaCodeForEngland], 'englandView'],
  ])('should return the expected chartView', (areaCodes, expected) => {
    expect(viewSelector(areaCodes)).toBe(expected);
  });
});

describe('getChartListForView', () => {
  it.each<[chartViews, string[], chartOptions[]]>([
    [
      'oneAreaView',
      ['foo'],
      ['populationPyramid', 'lineChart', 'barChart', 'inequalities'],
    ],
    ['oneAreaView', ['foo', 'bar'], ['populationPyramid', 'spineChart']],
    ['oneAreaView', ['foo', 'bar', 'baz'], ['populationPyramid', 'spineChart']],
    ['twoAreasView', ['foo'], ['populationPyramid', 'lineChart', 'barChart']],
    [
      'twoAreasView',
      ['foo', 'bar'],
      ['populationPyramid', 'spineChart', 'heatMap'],
    ],
    [
      'twoAreasView',
      ['foo', 'bar', 'baz'],
      ['populationPyramid', 'spineChart', 'heatMap'],
    ],
    ['threeOrMoreAreasView', ['foo'], ['populationPyramid', 'barChart']],
    ['threeOrMoreAreasView', ['foo', 'bar'], ['populationPyramid', 'heatMap']],
    [
      'threeOrMoreAreasView',
      ['foo', 'bar', 'baz'],
      ['populationPyramid', 'heatMap'],
    ],
    [
      'englandView',
      ['foo'],
      ['populationPyramid', 'lineChart', 'inequalities'],
    ],
    ['englandView', ['foo', 'bar'], ['populationPyramid', 'basicTable']],
    ['englandView', ['foo', 'bar', 'baz'], ['populationPyramid', 'basicTable']],
  ])(
    'should return the expected chartList for the viewSelected and selectedIndicators',
    (viewSelected, indicatorsSelected, expected) => {
      expect(getChartListForView(indicatorsSelected, viewSelected)).toEqual(
        expected
      );
    }
  );
});
