import { selectChartView } from './selectChartView';

describe('viewsSelector', () => {
  it('should return "oneAreaView" if passed a single area', () => {
    expect(selectChartView(['foo'])).toBe('oneAreaView');
  });
  it('should return "twoAreasView" if passed two areas', () => {
    expect(selectChartView(['foo', 'bar'])).toBe('twoAreasView');
  });
  it('should return "threeOrMoreAreasView" if passed three or more areas', () => {
    expect(selectChartView(['foo', 'bar', 'baz'])).toBe('threeOrMoreAreasView');
    expect(selectChartView(['foo', 'bar', 'baz', 'bert'])).toBe(
      'threeOrMoreAreasView'
    );
  });
  it.skip('should return "allAreasInGroup" if all the areas in the group are selected', () => {});
  it.skip('should return "England" if the areaTypeSelected is England', () => {});
});

// DW keeping this for the pattern
// describe('1 indicator, 2+ areas', () => {
//     it('should return LineChart: true GIVEN 1 indicator, 2 areas', () => {});
//     it('should return barChart: true', () => {});
//     it('should return inequalities: false', () => {});
//     it('should return populationPyramid: true', () => {});
//     it('should return thematicMap: true GIVEN 1 indicator, all areas in group', () => {});
//     it('should return spineChart: false', () => {});
//     it('should return heatMap: false', () => {});
//     it('should return basicTable: false', () => {});
//   });
