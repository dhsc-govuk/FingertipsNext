import { SearchParams } from '@/lib/searchStateManager';
import { spineChartRequestParams } from '@/components/charts/SpineChart/helpers/spineChartRequestParams';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';

const areas = ['E09000002', 'E09000003'];
const areaType = 'districts-and-unitary-authorities';
const indicators = ['41101', '22401'];
const group = 'E12000007';
const groupType = 'regions';
const searchState = {
  [SearchParams.AreasSelected]: areas,
  [SearchParams.AreaTypeSelected]: areaType,
  [SearchParams.IndicatorsSelected]: indicators,
  [SearchParams.GroupSelected]: group,
  [SearchParams.GroupTypeSelected]: groupType,
};

describe('spineChartRequestParams', () => {
  describe('scenario with group type and 2 areas', () => {
    it('should return 3 params (areas, group and england) per indicator', () => {
      const result = spineChartRequestParams(searchState);
      expect(result).toHaveLength(6);
    });

    it('should have a param object for each indicator for the areas selected', () => {
      const result = spineChartRequestParams(searchState);
      expect(result).toContainEqual({
        indicatorId: Number(indicators[0]),
        areaCodes: areas,
        areaType: areaType,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });

      expect(result).toContainEqual({
        indicatorId: Number(indicators[1]),
        areaCodes: areas,
        areaType: areaType,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });
    });

    it('should have a param object for each indicator for England', () => {
      const result = spineChartRequestParams(searchState);
      expect(result).toContainEqual({
        indicatorId: Number(indicators[0]),
        areaCodes: [areaCodeForEngland],
        areaType: 'england',
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });

      expect(result).toContainEqual({
        indicatorId: Number(indicators[1]),
        areaCodes: [areaCodeForEngland],
        areaType: 'england',
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });
    });

    it('should have a param object for each indicator for the group', () => {
      const result = spineChartRequestParams(searchState);
      expect(result).toContainEqual({
        indicatorId: Number(indicators[0]),
        areaCodes: [group],
        areaType: groupType,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });

      expect(result).toContainEqual({
        indicatorId: Number(indicators[1]),
        areaCodes: [group],
        areaType: groupType,
        latestOnly: true,
        benchmarkRefType: BenchmarkReferenceType.England,
      });
    });
  });

  it('sets ancestorCode when benchmarkSelected is not England', () => {
    const searchStateNonEnglandBenchmark = {
      ...searchState,
      [SearchParams.BenchmarkAreaSelected]: group,
    };

    const result = spineChartRequestParams(searchStateNonEnglandBenchmark);
    expect(
      result.every(
        (params) =>
          params.benchmarkRefType === BenchmarkReferenceType.SubNational
      )
    ).toBeTruthy();
    expect(
      result.every((params) => params.ancestorCode === group)
    ).toBeTruthy();
  });

  it('returns an empty array when no indicators are selected', () => {
    const searchState = {
      [SearchParams.GroupSelected]: 'GROUP789',
      [SearchParams.BenchmarkAreaSelected]: 'ENG',
    };

    const result = spineChartRequestParams(searchState);
    expect(result).toHaveLength(0);
  });
});
