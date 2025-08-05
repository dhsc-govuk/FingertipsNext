import OneIndicatorOneAreaView from './OneIndicatorOneAreaView';
import { SearchStateParams } from '@/lib/searchStateManager';
import OneIndicatorTwoOrMoreAreasView from './OneIndicatorTwoOrMoreAreasView';
import TwoOrMoreIndicatorsAreasView from './TwoOrMoreIndicatorsAreasView';
import { IndicatorDocument } from '@/lib/search/searchTypes';
import { Area } from '@/generated-sources/ft-api-client';

interface ViewsSelectorProps {
  areaCodes: string[];
  indicators: string[];
  searchState: SearchStateParams;
  selectedIndicatorsData?: IndicatorDocument[];
  availableAreas?: Area[];
}

export function ViewsSelector({
  areaCodes,
  indicators,
  searchState,
  selectedIndicatorsData,
  availableAreas,
}: Readonly<ViewsSelectorProps>) {
  if (indicators.length === 1 && areaCodes.length === 1) {
    return (
      <OneIndicatorOneAreaView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={searchState}
      />
    );
  }

  if (indicators.length === 1 && areaCodes.length >= 2) {
    return (
      <OneIndicatorTwoOrMoreAreasView
        selectedIndicatorsData={selectedIndicatorsData}
        searchState={searchState}
        availableAreas={availableAreas}
      />
    );
  }

  if (indicators.length >= 2 && areaCodes.length >= 1) {
    return (
      <TwoOrMoreIndicatorsAreasView
        searchState={searchState}
        selectedIndicatorsData={selectedIndicatorsData}
        availableAreas={availableAreas}
      />
    );
  }

  throw new Error('Parameters do not match any known view');
}
