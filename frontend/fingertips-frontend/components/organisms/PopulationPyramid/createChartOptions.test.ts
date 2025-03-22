import { createChartPyramidOptions } from './createChartOptions';
import { GovukColours } from '@/lib/styleHelpers/colours';

describe('createChartPyramidOptions', () => {
  const mockPopulationData = {
    areaName: 'Test Area',
    ageCategories: ['0-4', '5-9', '10-14'],
    femaleSeries: [100, 200, 150],
    maleSeries: [90, 180, 140],
  };

  it('should return a valid Highcharts.Options object', () => {
    const options = createChartPyramidOptions(
      'Age',
      'Population (%)',
      'Accessibility Label',
      mockPopulationData
    );

    expect(options).toBeDefined();
    expect(options.chart?.type).toBe('bar');
    expect(options.xAxis).toHaveLength(2);
    expect(options.series).toHaveLength(2);
  });

  it('should add additional series when benchmark is provided', () => {
    const benchmarkData = {
      areaName: 'Benchmark Area',
      ageCategories: ['0-4', '5-9', '10-14'],
      femaleSeries: [110, 210, 160],
      maleSeries: [100, 190, 150],
    };
    const options: Highcharts.Options = createChartPyramidOptions(
      'Age',
      'Population (%)',
      'Accessibility Label',
      mockPopulationData,
      benchmarkData
    );
    expect(options.series).toHaveLength(4);
    expect(options.series[2].name).toContain('Benchmark: Benchmark Area');
  });

  it('should add additional series when group data is provided', () => {
    const groupData = {
      areaName: 'Group Name',
      ageCategories: ['0-4', '5-9', '10-14'],
      femaleSeries: [110, 210, 160],
      maleSeries: [100, 190, 150],
    };
    const options: Highcharts.Options = createChartPyramidOptions(
      'Age',
      'Population (%)',
      'Accessibility Label',
      mockPopulationData,
      undefined,
      groupData
    );

    expect(options.series).toHaveLength(4);
    expect(options.series[2].name).toContain('Group: Group Name');
  });

  it('should add additional series when group data and benchmark data is provided', () => {
    const groupData = {
      areaName: 'Group Name',
      ageCategories: ['0-4', '5-9', '10-14'],
      femaleSeries: [110, 210, 160],
      maleSeries: [100, 190, 150],
    };

    const benchmarkData = {
      areaName: 'Benchmark Area',
      ageCategories: ['0-4', '5-9', '10-14'],
      femaleSeries: [110, 210, 160],
      maleSeries: [100, 190, 150],
    };
    const options: Highcharts.Options = createChartPyramidOptions(
      'Age',
      'Population (%)',
      'Accessibility Label',
      mockPopulationData,
      benchmarkData,
      groupData
    );
    expect(options.series).toHaveLength(6);
  });

  it('should set correct colors for series', () => {
    const options = createChartPyramidOptions(
      'Age',
      'Population (%)',
      'Accessibility Label',
      mockPopulationData
    );

    expect(options.series?.[0].color).toBe(GovukColours.PurpleBlue);
    expect(options.series?.[1].color).toBe(GovukColours.BrightSkyBlue);
  });
});
