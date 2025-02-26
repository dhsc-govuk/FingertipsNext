import { describe } from 'node:test';
import { viewSelector } from './viewUtils';

describe('viewsSelector', () => {
  it('should return "oneAreaView" if passed a single area', () => {
    expect(viewSelector(['foo'])).toBe('oneAreaView');
  });
  it('should return "twoAreasView" if passed two areas', () => {
    expect(viewSelector(['foo', 'bar'])).toBe('twoAreasView');
  });
  it('should return "threeOrMoreAreasView" if passed three or more areas', () => {
    expect(viewSelector(['foo', 'bar', 'baz'])).toBe('threeOrMoreAreasView');
    expect(viewSelector(['foo', 'bar', 'baz', 'bert'])).toBe(
      'threeOrMoreAreasView'
    );
  });
  it.skip('should return "allAreasInGroup" if all the areas in the group are selected', () => {});
  it.skip('should return "England" if the areaTypeSelected is England', () => {});
});

describe('getChartListForView', () => {
  it('should return the expected chartList for given areaView ');
});
