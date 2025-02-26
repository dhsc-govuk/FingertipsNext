import { selectView } from './viewUtils';

describe('viewsSelector', () => {
  it('should return "oneAreaView" if passed a single area', () => {
    expect(selectView(['foo'])).toBe('oneAreaView');
  });
  it('should return "twoAreasView" if passed two areas', () => {
    expect(selectView(['foo', 'bar'])).toBe('twoAreasView');
  });
  it('should return "threeOrMoreAreasView" if passed three or more areas', () => {
    expect(selectView(['foo', 'bar', 'baz'])).toBe('threeOrMoreAreasView');
    expect(selectView(['foo', 'bar', 'baz', 'bert'])).toBe(
      'threeOrMoreAreasView'
    );
  });
  it.skip('should return "allAreasInGroup" if all the areas in the group are selected', () => {});
  it.skip('should return "England" if the areaTypeSelected is England', () => {});
});
