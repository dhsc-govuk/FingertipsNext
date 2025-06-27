import { SearchParams } from '@/lib/searchStateManager';
import { quartilesQueryParams } from '@/components/charts/SpineChart/helpers/quartilesQueryParams';
import { areaCodeForEngland } from '@/lib/chartHelpers/constants';
import { BenchmarkReferenceType } from '@/generated-sources/ft-api-client';

describe('quartilesQueryParams', () => {
  it('returns correct parameters with full input', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A1'],
      [SearchParams.IndicatorsSelected]: ['101', '102'],
      [SearchParams.GroupSelected]: 'GROUP1',
      [SearchParams.AreaTypeSelected]: 'ICB',
      [SearchParams.BenchmarkAreaSelected]: 'ENG',
    };

    const result = quartilesQueryParams(searchState);

    expect(result).toEqual({
      indicatorIds: [101, 102],
      areaCode: 'A1',
      ancestorCode: 'GROUP1',
      areaType: 'ICB',
      benchmarkRefType: BenchmarkReferenceType.SubNational,
    });
  });

  it('defaults ancestorCode to areaCodeForEngland when GroupSelected is missing', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A2'],
      [SearchParams.IndicatorsSelected]: ['200'],
      [SearchParams.AreaTypeSelected]: 'LA',
      [SearchParams.BenchmarkAreaSelected]: 'ENG',
    };

    const result = quartilesQueryParams(searchState);

    expect(result.ancestorCode).toBe(areaCodeForEngland);
  });

  it('handles empty indicators list gracefully', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['A3'],
      [SearchParams.AreaTypeSelected]: 'LA',
      [SearchParams.GroupSelected]: 'GROUP3',
      [SearchParams.BenchmarkAreaSelected]: 'ENG',
    };

    const result = quartilesQueryParams(searchState);

    expect(result.indicatorIds).toEqual([]);
  });

  it('uses the first areaCode returned by determineAreaCodes', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['X', 'Y'],
      [SearchParams.IndicatorsSelected]: ['999'],
      [SearchParams.AreaTypeSelected]: 'Region',
      [SearchParams.BenchmarkAreaSelected]: 'BENCH1',
      [SearchParams.GroupAreaSelected]: 'GROUP1',
    };

    const result = quartilesQueryParams(searchState);

    expect(result.areaCode).toBe('X');
  });

  it('returns the benchmarkRef when england is the selected', () => {
    const searchState = {
      [SearchParams.AreasSelected]: ['Z'],
      [SearchParams.IndicatorsSelected]: ['300'],
      [SearchParams.AreaTypeSelected]: 'Region',
      [SearchParams.BenchmarkAreaSelected]: areaCodeForEngland,
    };

    const result = quartilesQueryParams(searchState);
    expect(result.benchmarkRefType).toEqual(BenchmarkReferenceType.England);
  });
});
