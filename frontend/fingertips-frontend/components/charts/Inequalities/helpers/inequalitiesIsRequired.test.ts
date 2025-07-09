import { SearchParams } from '@/lib/searchStateManager';
import { inequalitiesIsRequired } from '@/components/charts/Inequalities/helpers/inequalitiesIsRequired';

describe('inequalitiesIsRequired', () => {
  it('returns false when no indicators are selected', () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: [],
      [SearchParams.AreasSelected]: ['area1'],
    };

    expect(inequalitiesIsRequired(searchState)).toBe(false);
  });

  it('returns false when multiple areas are selected', () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: ['123'],
      [SearchParams.AreasSelected]: ['area1', 'area2'],
    };

    expect(inequalitiesIsRequired(searchState)).toBe(false);
  });

  it('returns true when one indicator and one area is selected', () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: ['456'],
      [SearchParams.AreasSelected]: ['area1'],
    };

    expect(inequalitiesIsRequired(searchState)).toBe(true);
  });

  it('returns false when one indicator and no areas are selected', () => {
    const searchState = {
      [SearchParams.IndicatorsSelected]: ['789'],
      [SearchParams.AreasSelected]: [],
    };

    expect(inequalitiesIsRequired(searchState)).toBe(false);
  });

  it('returns false when neither indicators nor areas are provided', () => {
    const searchState = {};

    expect(inequalitiesIsRequired(searchState)).toBe(false);
  });
});
